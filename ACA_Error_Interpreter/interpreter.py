import os
import subprocess
import xml.etree.ElementTree as ET
import tkinter as tk
from tkinter import filedialog
import datetime
import pdfkit
import ctypes

# Constants
XML_NAMESPACE = "{urn:us:gov:treasury:irs:ext:aca:air:"
PROMPT_TITLE = 'IRS ACA Errors Report'
CONFIG = pdfkit.configuration(wkhtmltopdf="wkhtmltox/bin/wkhtmltopdf.exe")

def redirect_print_to_file(statement, file_name):
    with open(file_name, 'a') as file:
        print(statement, file=file)

def prompt_file(title):
    root = tk.Tk()
    root.withdraw()
    ctypes.windll.user32.MessageBoxW(0, title, PROMPT_TITLE, 0)
    return filedialog.askopenfilename()

def extract_error_details(root, year):
    euser_id_list = []
    euser_error_list = []
    company_error_list = []
    sub_status = ''

    for form_detail in root.find(f"{XML_NAMESPACE}{year}ACATransmitterSubmissionDetail"):
        if form_detail.tag == f"{XML_NAMESPACE}{year}TransmitterErrorDetailGrp":
            if form_detail.find(f"{XML_NAMESPACE}{year}UniqueRecordId") is not None:
                euser_id_raw = form_detail.find(f"{XML_NAMESPACE}{year}UniqueRecordId")
                euser_id_text = euser_id_raw.text
                euser_id = euser_id_text.split('|')[2]
                euser_error = form_detail[1][1].text
                euser_id_list.append(euser_id)
                euser_error_list.append(euser_error)
            else:
                if form_detail.find(f"{XML_NAMESPACE}{year}UniqueSubmissionId") is not None:
                    if form_detail.find(f"{XML_NAMESPACE}{year}SubmissionLevelStatusCd") is None:
                        company_error = form_detail[1][1].text
                        company_error_list.append(company_error)
                    else:
                        sub_status = form_detail.find(f"{XML_NAMESPACE}{year}SubmissionLevelStatusCd").text

    return euser_id_list, euser_error_list, company_error_list, sub_status

def process_users(root, year, euser_id_list, euser_error_list, company_error_list, date, unique_sid, output_directory):
    euser_dictionary = dict(zip(euser_id_list, euser_error_list))

    for form_detail in root.find(f"{XML_NAMESPACE}{year}Form1094CUpstreamDetail"):
        if form_detail.tag == f"{XML_NAMESPACE}{year}EmployerInformationGrp":
            business = form_detail.find(f"{XML_NAMESPACE}{year}BusinessName")
            business_name = business.find(f"{XML_NAMESPACE}{year}BusinessNameLine1Txt").text
            output_file_name = f"{business_name} Error Report.txt"
            output_file_name_html = f"{business_name} Error Report.html"
            output_file_name_pdf = os.path.join(output_directory, f"{business_name} Error Report.pdf")
            redirect_print_to_file(f"Company Name: {business_name}\n", output_file_name)
            redirect_print_to_file(f"Date: {date}\n", output_file_name)
            redirect_print_to_file(f"Submission ID: {unique_sid}\n", output_file_name)
            redirect_print_to_file(f"Submission Status: {sub_status}\n", output_file_name)
            now_ordered = datetime.datetime.now().strftime("%m-%d-%Y, %H:%M:%S")
            redirect_print_to_file(f"Report Ran: {now_ordered}\n", output_file_name)
            for cerror in company_error_list:
                cerror_report = f"Name: {business_name}\nError: {cerror}\n"
                redirect_print_to_file(cerror_report, output_file_name)

        if form_detail.tag == f"{XML_NAMESPACE}{year}Form1095CUpstreamDetail":
            user_id = form_detail.find(f"{XML_NAMESPACE}{year}RecordId").text
            if user_id in euser_id_list:
                employee_info = form_detail.find(f"{XML_NAMESPACE}{year}EmployeeInfoGrp")
                names = employee_info.find(f"{XML_NAMESPACE}{year}OtherCompletePersonName")
                user_fn = names.find(f"{XML_NAMESPACE}{year}PersonFirstNm").text
                user_ln = names.find(f"{XML_NAMESPACE}{year}PersonLastNm").text
                user_mn = names.find(f"{XML_NAMESPACE}{year}PersonMiddleNm").text if names.find(f"{XML_NAMESPACE}{year}PersonMiddleNm") is not None else ""
                user_error_report = f"Name: {user_fn} {user_mn} {user_ln}\nRecord ID: {user_id}\nError: {euser_dictionary[user_id]}\n" if user_mn else f"Name: {user_fn} {user_ln}\nRecord ID: {user_id}\nError: {euser_dictionary[user_id]}\n"
                redirect_print_to_file(user_error_report, output_file_name)

def convert_to_html_pdf(output_file_name, output_file_name_html, output_file_name_pdf):
    with open(output_file_name) as file:
        text = file.read()

    html_text = '<html>\n<body>\n'
    for line in text.split('\n\n'):
        html_text += '<div style="display:block; clear:both; page-break-inside:avoid;">'
        html_text += '<p style="font-family: helvetica;">'
        for line2 in line.split('\n'):
            line3 = line2.split(': ')
            if len(line3) > 1:
                html_text += f'<span><b>{line3[0]}: </b>{line3[1]}<br></span>'
        html_text += '</p>\n'
        html_text += '</div>'
    html_text += '</body>\n</html>'

    with open(output_file_name_html, 'w') as file:
        file.write(html_text)

    path = os.path.abspath(output_file_name_html)
    pdfkit.from_file(path, output_file_name_pdf, configuration=CONFIG)
    os.remove(output_file_name)
    os.remove(output_file_name_html)

if __name__ == "__main__":
    file_path = prompt_file('Select Request File')
    output_directory = os.path.dirname(file_path)
    file_path2 = prompt_file('Select Acknowledgement File')

    file_name2 = os.path.basename(file_path2)
    unique_sid = file_name2.split('_')[1]
    date = file_name2.split('_')[2]
    year = file_name2.split('_')[-1].split('.')[0]

    tree_users = ET.parse(file_path)
    root_users = tree_users.getroot()

    tree_eusers = ET.parse(file_path2)
    root_eusers = tree_eusers.getroot()

    euser_id_list, euser_error_list, company_error_list, sub_status = extract_error_details(root_eusers, year)

    process_users(root_users, year, euser_id_list, euser_error_list, company_error_list, date, unique_sid, output_directory)

    output_file_name = f"{output_directory}/{business_name} Error Report.txt"
    output_file_name_html = f"{output_directory}/{business_name} Error Report.html"
    output_file_name_pdf = f"{output_directory}/{business_name} Error Report.pdf"

    convert_to_html_pdf(output_file_name, output_file_name_html, output_file_name_pdf)

    subprocess.Popen([output_file_name_pdf], shell=True)

