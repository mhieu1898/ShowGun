#!/usr/bin/python3

import os
import time
import sys

import base64
import simplejson
import math
import importlib
import zipfile
from html.parser import HTMLParser

if sys.getdefaultencoding() != 'utf-8':
    importlib.reload(sys)
    sys.setdefaultencoding('utf-8')

settingMatchKey = '{#settings}'
mainMatchKey = '{#main}'
engineMatchKey = '{#cocosengine}'
projectMatchKey = '{#project}'
resMapMatchKey = '{#resMap}'
indexInterMatchKey = '{#indexInternal}'

fileByteList = ['.png', '.jpg', '.mp3', '.ttf',
                '.atlas', '.plist', '.bin', 'bundle', '.mp4']

base64PrefixList = {
    '.png': 'data:image/png;base64,',
    '.jpg': 'data:image/jpeg;base64,',
    '.mp3': '',
    '.ttf': '',
    '.atlas': '',
    '.plist': 'data:text/plist;base64,',
    '.bin': '',
    '.mp4': 'data:video/mp4;base64,',
}


def read_in_chunks(filePath):
    extName = os.path.splitext(filePath)[1]
    if extName in fileByteList:
        file_object = open(filePath, 'rb')
        base64Str = base64.b64encode(file_object.read()).decode('utf-8')
        base64Prefix = base64PrefixList[extName]
        if base64Prefix != None:
            # base64Str = bytes(base64Prefix, 'utf-8') + base64Str
            base64Str = base64Prefix + base64Str
            return base64Str
    elif extName == '':
        return None

    file_object = open(filePath, encoding='utf-8')
    print("filepath = " + filePath)
    return file_object.read()


def writeToPath(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(data)


def getResMap(jsonObj, path, resPath):
    fileList = os.listdir(path)
    for fileName in fileList:
        absPath = path + '/' + fileName
        if (os.path.isdir(absPath)):
            getResMap(jsonObj, absPath, resPath)
        elif (os.path.isfile(absPath) and absPath.find("main/index.js") == -1):
            dataStr = read_in_chunks(absPath)
            if dataStr != None:
                absPath = absPath.replace(resPath + '/', '')
                jsonObj[absPath] = dataStr


def getResMapScript(resPath):
    jsonObj = {}
    getResMap(jsonObj, resPath, resPath)
    jsonStr = simplejson.dumps(jsonObj)
    resStr = str("window.resMap = ") + jsonStr
    return resStr


def fixEngineError(engineStr):
    newEngineStr = engineStr.replace(
        "t.content instanceof Image", "t.content.tagName === \"IMG\"", 1)
    return newEngineStr


def addPlistSupport(mainStr):
    newMainStr = mainStr.replace(
        "json: jsonBufferHandler,", "json: jsonBufferHandler, plist: jsonBufferHandler,", 1)
    return newMainStr


def merge(projectRootPath):
    if (not os.path.isdir('playableAds')):
        os.mkdir('playableAds')

    htmlPath = projectRootPath + '/build/web-mobile/index.html'
    newHtmlPath = projectRootPath + '/playableAds/index.html'
    settingScrPath = projectRootPath + '/build/web-mobile/src/settings.js'
    mainScrPath = projectRootPath + '/build/web-mobile/main.js'
    engineScrPath = projectRootPath + '/build/web-mobile/cocos2d-js-min.js'
    projectScrPath = projectRootPath + '/build/web-mobile/assets/main/index.js'
    resPath = projectRootPath + '/build/web-mobile/assets'
    indexInternalScrPath = projectRootPath + \
        '/build/web-mobile/assets/internal/index.js'

    htmlStr = read_in_chunks(htmlPath)
    settingsStr = read_in_chunks(settingScrPath)
    htmlStr = htmlStr.replace(settingMatchKey, settingsStr, 1)

    projectStr = read_in_chunks(projectScrPath)
    htmlStr = htmlStr.replace(projectMatchKey, projectStr, 1)

    indexInterStr = read_in_chunks(indexInternalScrPath)
    htmlStr = htmlStr.replace(indexInterMatchKey, indexInterStr, 1)

    mainStr = read_in_chunks(mainScrPath)
    mainStr = addPlistSupport(mainStr)
    htmlStr = htmlStr.replace(mainMatchKey, mainStr, 1)

    engineStr = read_in_chunks(engineScrPath)
    engineStr = fixEngineError(engineStr)
    htmlStr = htmlStr.replace(engineMatchKey, engineStr, 1)

    resStr = getResMapScript(resPath)
    htmlStr = htmlStr.replace(resMapMatchKey, resStr, 1)

    writeToPath(newHtmlPath, htmlStr)

    targetFileSize = os.path.getsize(newHtmlPath)
    targetFileSizeInMegabyte = math.ceil(
        targetFileSize * 1000 / (1024 * 1024)) / 1000

    print("Path = {}, with size {}M".format(
        newHtmlPath, targetFileSizeInMegabyte))


def extract_multi_platfrom(html_file_name, build_file_name, adNetwork=None, adSize=None):
    with open(html_file_name, "r", encoding='utf8') as htmlFile:
        htmlStr = htmlFile.read()
        if adNetwork:
            htmlStr = htmlStr.replace('__adNetwork__', adNetwork)
        if adSize:
            htmlStr = htmlStr.replace('<!--__MetaAdSize__-->', '<meta name="ad.size" content="width=' +
                                      adSize['width'] + ',height=' + adSize['height'] + '">')
        else:
            htmlStr = htmlStr.replace('<!--__MetaAdSize__-->', '')
        with open(build_file_name, "w", encoding='utf8') as buildFile:
            buildFile.write(htmlStr)


if __name__ == '__main__':
    workDir = os.getcwd()
    merge(workDir)
    print('=======  BUILD ======')
    htmlPath = workDir + '/playableAds/index.html'
    extract_multi_platfrom(htmlPath, 'playableAds/unity.html', 'unity')
    extract_multi_platfrom(htmlPath, 'playableAds/applovin.html', 'applovin')
    extract_multi_platfrom(htmlPath, 'playableAds/facebook.html', 'facebook')

    extract_multi_platfrom(htmlPath, 'playableAds/index.html',
                           'adword', {'width': '480', 'height': '320'})
    zip = zipfile.ZipFile("playableAds/adword_480_320.zip",
                          "w", zipfile.ZIP_DEFLATED)
    zip.write("playableAds/index.html", "index.html")
    zip.close()

    extract_multi_platfrom(htmlPath, 'playableAds/index.html',
                           'adword', {'width': '320', 'height': '480'})
    zip = zipfile.ZipFile("playableAds/adword_320_480.zip",
                          "w", zipfile.ZIP_DEFLATED)
    zip.write("playableAds/index.html", "index.html")
    zip.close()

    print("Build playable ads google_ads Done!")
