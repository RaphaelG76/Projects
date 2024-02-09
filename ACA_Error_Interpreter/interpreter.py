import os
import subprocess
import xml.etree.ElementTree as ET
import tkinter as tk
from tkinter import filedialog
import datetime
import pdfkit
import ctypes


def redirect_print_to_file(statement, file_name):
    with open(file_name, 'a') as file:
        print(statement, file=file)


# Get the directory of the current script
current_folder = os.path.dirname(__file__)

# configure htmltopdf script
wkhtmltopdf_path = os.path.join(current_folder, 'wkhtmltox', 'bin', 'wkhtmltopdf.exe')
config = pdfkit.configuration(
    wkhtmltopdf=wkhtmltopdf_path)

# prompt for files
prompt_users = 'Select Request File'
prompt_errors = 'Select Acknowledgement File'
title = 'IRS ACA Errors Report'
root = tk.Tk()
root.withdraw()
ctypes.windll.user32.MessageBoxW(0, prompt_users, title, 0)
file_path = filedialog.askopenfilename()
output_directory = ('/'.join(file_path.split('/')[:-1]))
ctypes.windll.user32.MessageBoxW(0, prompt_errors, title, 0)
file_path2 = filedialog.askopenfilename()

# extract error file name
file_name2 = os.path.basename(file_path2)

unique_sid = file_name2.split('_')[1]
date = file_name2.split('_')[2]

tree_users = ET.parse(file_path)  # list of users
root_users = tree_users.getroot()

tree_eusers = ET.parse(file_path2)  # list of users with errors
root_eusers = tree_eusers.getroot()

# initialize values
euser_id_list = []
euser_error_list = []
company_error_list = []
sub_status = ''
user_id = ''
output_file_name = ''
output_file_name_html = ''
output_file_name_pdf = ''

# extract namespace year (ts22,ts23,etc.)
space = str(root_eusers[0])
start_index = space.find('{') + 1
end_index = space.find('}')
numbers_part = space[start_index:end_index]
element_list = [element.strip() for element in numbers_part.split(':')]
year = element_list[-1]
now = datetime.datetime.now()
now_no_seconds = str(now).split('.')[0]
now_no_time = now_no_seconds.split(' ')
now_ordered_split = now_no_time[0].split('-')
now_ordered = (now_ordered_split[1] + '-' + now_ordered_split[2] + '-' + now_ordered_split[0] + ', ' +
               now_no_time[1])

# iterate through error form
for index, form_detail in enumerate(
        root_eusers.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}ACATransmitterSubmissionDetail')):
    if form_detail.tag == '{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}TransmitterErrorDetailGrp':
        if form_detail.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}UniqueRecordId') is not None:
            euser_id_raw = (form_detail.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}UniqueRecordId'))
            euser_id_text = euser_id_raw.text  # users with error id
            euser_id = euser_id_text.split('|')[2]
            euser_error = form_detail[1][1].text  # error details for users with errors (cant use find because of ns2:)
            euser_id_list.append(euser_id)
            euser_error_list.append(euser_error)
        else:
            if form_detail.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}UniqueSubmissionId') is not None:
                if form_detail.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year +
                                    '}SubmissionLevelStatusCd') is None:
                    company_error = form_detail[1][1].text
                    company_error_list.append(company_error)
                else:
                    sub_status = form_detail.find(
                        '{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}SubmissionLevelStatusCd').text
# create dictionary based off error user ids as keys and error user errors as values
euser_dictionary = dict(zip(euser_id_list, euser_error_list))

# prints user id's and names from 'users.xml'
for form_detail in root_users.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}Form1094CUpstreamDetail'):
    if form_detail.tag == '{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}EmployerInformationGrp':
        business = (form_detail.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}BusinessName'))
        business_name = business.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}BusinessNameLine1Txt').text
        output_file_name = business_name + " Error Report.txt"
        output_file_name_html = business_name + " Error Report.html"
        output_file_name_pdf = os.path.join(output_directory, business_name + " Error Report.pdf")
        redirect_print_to_file("Company Name: " + business_name + "\n", output_file_name)
        redirect_print_to_file("Date: " + date + "\n", output_file_name)
        redirect_print_to_file("Submission ID: " + unique_sid + "\n", output_file_name)
        redirect_print_to_file("Submission Status: " + sub_status + "\n", output_file_name)
        redirect_print_to_file("Report Ran: " + now_ordered + "\n", output_file_name)
        for cerror in company_error_list:
            cerror_report = ("Name: " + business_name + "\n" + "Error: "
                             + cerror + "\n")
            redirect_print_to_file(cerror_report, output_file_name)
    if form_detail.tag == '{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}Form1095CUpstreamDetail':
        if form_detail.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}RecordId') is not None:
            # variable for user ids
            user_id = form_detail.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}RecordId').text

        if user_id in euser_id_list:
            if form_detail.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}EmployeeInfoGrp') is not None:
                employee_info = form_detail.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}EmployeeInfoGrp')
                names = employee_info.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}OtherCompletePersonName')

                # variable for first names
                user_fn = names.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}PersonFirstNm').text
                # variable for last names
                user_ln = names.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}PersonLastNm').text
                # variable for middle names
                if names.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}PersonMiddleNm') is not None:
                    user_mn = names.find('{urn:us:gov:treasury:irs:ext:aca:air:' + year + '}PersonMiddleNm').text
                    user_error_report = ("Name: " + user_fn + " " + user_mn + " " + user_ln + "\n" + "Record ID: " +
                                         user_id + "\n" + "Error: "
                                         + euser_dictionary[user_id] + "\n")
                    redirect_print_to_file(user_error_report, output_file_name)
                else:
                    user_error_report = ("Name: " + user_fn + " " + user_ln + "\n" + "Record ID: " +
                                         user_id + "\n" "Error: " +
                                         euser_dictionary[user_id] + "\n")
                    redirect_print_to_file(user_error_report, output_file_name)
        else:
            pass

# read text file into text variable
file = open(output_file_name)
text = file.read()
file.close()

# convert txt to html
html_text = '<html>\n<body>\n'
for line in text.split('\n\n'):
    html_text += '<div style = "display:block; clear:both; page-break-inside:avoid;">'
    html_text += '<p style = "font-family: helvetica;">'
    for line2 in line.split('\n'):
        line3 = line2.split(': ')
        if len(line3) > 1:
            html_text += f'<span><b>{line3[0]}: </b>{line3[1]}<br></span>'
    html_text += '</p>\n'
    html_text += '</div>'
html_text += '</body>\n</html>'

# save the html file
with open(output_file_name_html, 'w') as file:
    file.write(html_text)

# convert html to pdf
path = os.path.abspath(output_file_name_html)
pdfkit.from_file(path, output_file_name_pdf, configuration=config)

# remove non-pdf forms
os.remove(output_file_name)
os.remove(output_file_name_html)

# open pdf
subprocess.Popen([output_file_name_pdf], shell=True)