import json
import requests
from bs4 import BeautifulSoup
import os
import re
import time
#---------------------------------------------------#
# This script will access the JSON from the binance API to get the live price percent change of DogeCoin
# It will take that number and display it on the index.html page along with red/green if its +/- 
# For this script to work, make sure either a)proxy is off, or b) python -m pip install pip-system-certs
# or 
#---------------------------------------------------#
  
while True:
    time.sleep(1)
    # requesting data from URL Binance JSON API
    key = "https://api.binance.com/api/v1/ticker/24hr?symbol=DOGEUSDT"
    data = requests.get(key)  
    data = data.json()
    percent = data['priceChangePercent']
    print(f"{percent} is the percent change for DogeCoin")

    #setup html parser to find section to change
    base=os.path.dirname(os.path.abspath("__file__"))
    html=open(os.path.join(base, "index.html"))
    soup=BeautifulSoup(html, "html.parser")


    #change stock price
    if(float(percent) <= 0):
        #change percent
        oldD=soup.find(class_="percentChange")
        newD=oldD.find(text=re.compile("")).replace_with(f"{str(percent)}%")
        #change color
        oldD=soup.find(class_="percentColor")
        oldD["style"] = "color:red"
        #change triangle
        oldD=soup.find(class_="percentTriangle")
        oldD["style"] = "transform: rotate(180deg)"
        print("sad face")
    else:
        #change percent
        oldD=soup.find(class_="percentChange")
        newD=oldD.find(text=re.compile("")).replace_with(f"+ {str(percent)}%")
        #change color
        oldD=soup.find(class_="percentColor")
        oldD["style"] = "color:green"
        #change triangle
        oldD=soup.find(class_="percentTriangle")
        oldD["style"] = "transform: rotate(0deg)"
        print("happy face")
        #edit html

    #write the change to the html file
    with open("index.html", "wb") as f_output:
        f_output.write(soup.prettify("utf-8"))

