const db = require('../utils/db').pool;
const puppeteer = require('puppeteer');
const translate = require('@iamtraction/google-translate');
const pagination = require('../utils/pagination');

async function startBrowser() {
    let browser;
    try {
        console.log("Opening the browser......");
        browser = await puppeteer.launch({
            headless: 'false',
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

const scraperObject = {
    url: '',
    async scraper(browser, url) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        let dataArray = [];
        await page.goto(url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('.nodeListLayout .volume');
        // Get the link to all the required books
        console.log("Scraping all the links...");
        let urls = await page.$$eval('div ul > li', links => {
            // Make sure the book to be scraped is in stock
            links = links.filter(link => {
                const state = link.querySelector('.icon_close')
                return state ? false : true;
            })
            // Extract the links from the data
            links = links.map(el => el.querySelector('a').href)
            return links;
        });
        console.log('Links extracted.\n================================')
        // Loop through each of those links, open a new page instance and get the relevant data from them
        let pagePromise = (link) => new Promise(async (resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            let title = await newPage.$eval('.nodeTitle', text => text.childNodes[3].textContent)
            let content = await newPage.$eval('.nodeContent', text => text.textContent);
            // dataObj['chapterTitle'] = title;
            dataObj['chapterTitle'] = await translatePromise(title);
            dataObj['chapterContent'] = content;
            // dataObj['chapterContent'] = await translatePromise(content);
            resolve(dataObj);
            await newPage.close();
        });

        for (link in urls) {
            if (link > 50) {
                console.log(`Scraping ${urls[link]}`);
                let currentPageData = await pagePromise(urls[link]);
                dataArray.push(currentPageData);
                if (link == urls.length - 1) {
                    console.log("================================\nScraped all the urls.\n")
                }
            }
        }
        return dataArray;
    }
}

const scraperShoudashuObject = {
    url: '',
    async scraper(browser, url, bid, nid) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        let dataArray = [];
        await page.goto(url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('.chapterlist ul');
        // Get the link to all the required books
        console.log("Scraping all the links...");
        let urls = await page.$$eval('.chapterlist ul li', (links) => {
            // Extract the links from the data
            links = links.map(el => (el.querySelector('a').href))
            return links;
        });
        console.log('Links extracted.\n================================')
        // Loop through each of those links, open a new page instance and get the relevant data from them
        let pagePromise = (link) => new Promise(async (resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            let title = await newPage.$eval('.main h1', text => text.textContent)
            let content = await newPage.$eval('#content', text => text.textContent);
            // dataObj['chapterTitle'] = title;
            dataObj['chapterTitle'] = await translatePromise(title);
            dataObj['chapterContent'] = content;
            // dataObj['chapterContent'] = await translatePromise(content);
            resolve(dataObj);
            await newPage.close();
        });

        for (link in urls) {
            console.log(`Scraping ${urls[link]}`);
            let currentPageData = await pagePromise(urls[link]);
            dataArray.push(currentPageData);
            if (link == urls.length - 1) {
                console.log("================================\nScraped all the urls.\n")
            }
        }
        return dataArray;
    }
}

const scraperFfxs8Object = {
    url: '',
    async scraper(browser, url) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        let dataArray = [];
        await page.goto(url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('.info-right .catalog ul');
        // Get the link to all the required books
        console.log("Scraping all the links...");
        let urls = await page.$$eval('.info-right .catalog ul li', (links) => {
            // Extract the links from the data
            links = links.map(el => (el.querySelector('a').href))
            return links;
        });
        console.log('Links extracted.\n================================')
        // Loop through each of those links, open a new page instance and get the relevant data from them
        let pagePromise = (link) => new Promise(async (resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            let title = await newPage.$eval('.article h1', text => text.textContent)
            let content = await newPage.$eval('.article .content', text => text.textContent);
            // dataObj['chapterTitle'] = title;
            dataObj['chapterTitle'] = await translatePromise(title);
            dataObj['chapterContent'] = content;
            // dataObj['chapterContent'] = await translatePromise(content);
            resolve(dataObj);
            await newPage.close();
        });

        for (link in urls) {
            console.log(`Scraping ${urls[link]}`);
            let currentPageData = await pagePromise(urls[link]);
            dataArray.push(currentPageData);
            if (link == urls.length - 1) {
                console.log("================================\nScraped all the urls.\n")
            }
        }
        return dataArray;
    }
}

const getData = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const { url } = req.body;

    let browserInstance = startBrowser();
    const browser = await browserInstance;
    const scrapedData = await scraperObject.scraper(browser, url);
    res.json(scrapedData);

    await browser.close();

}

const getShoudashuData = async (req, res) => {
    let { url } = req.body;
    if (url.slice(-1) != "/") {
        url += "/";
    }
    const urlParts = url.split("/")
    const bid = urlParts[urlParts.length - 3]
    const nid = urlParts[urlParts.length - 2]

    let browserInstance = startBrowser();
    const browser = await browserInstance;
    const scrapedData = await scraperShoudashuObject.scraper(browser, url, bid, nid);
    res.json(scrapedData);

    await browser.close();

}

const getFfxs8Data = async (req, res) => {
    let { url } = req.body;

    let browserInstance = startBrowser();
    const browser = await browserInstance;
    const scrapedData = await scraperFfxs8Object.scraper(browser, url);
    res.json(scrapedData);

    await browser.close();

}

const scraperMtlObject = {
    url: '',
    async scraper(browser, url) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        let dataArray = [];
        await page.goto(url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('.nodeListLayout .volume');
        // Get the link to all the required books
        console.log("Scraping all the links...");
        let urls = await page.$$eval('div ul > li', links => {
            // Make sure the book to be scraped is in stock
            links = links.filter(link => {
                const state = link.querySelector('.icon_close')
                return state ? false : true;
            })
            // Extract the links from the data
            links = links.map(el => el.querySelector('a').href)
            return links;
        });
        console.log('Links extracted.\n================================')
        // Loop through each of those links, open a new page instance and get the relevant data from them
        let pagePromise = (link) => new Promise(async (resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            let title = await newPage.$eval('.nodeTitle', text => text.childNodes[3].textContent)
            let content = await newPage.$eval('.nodeContent', text => text.textContent);
            dataObj['chapterTitle'] = title;
            dataObj['chapterTitle'] = await translatePromise(title);
            // dataObj['chapterContent'] = content;
            dataObj['chapterContent'] = await translatePromise(content);
            resolve(dataObj);
            await newPage.close();
        });

        for (link in urls) {
            console.log(`Scraping ${urls[link]}`);
            let currentPageData = await pagePromise(urls[link]);
            dataArray.push(currentPageData);
            if (link == urls.length - 1) {
                console.log("================================\nScraped all the urls.\n")
            }
        }
        return dataArray;
    }
}

const scraperMtlShoudashuObject = {
    url: '',
    async scraper(browser, url, bid, nid) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        let dataArray = [];
        await page.goto(url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('.chapterlist ul');
        // Get the link to all the required books
        console.log("Scraping all the links...");
        let urls = await page.$$eval('.chapterlist ul li', (links) => {
            // Extract the links from the data
            links = links.map(el => (el.querySelector('a').href))
            return links;
        });
        console.log('Links extracted.\n================================')
        // Loop through each of those links, open a new page instance and get the relevant data from them
        let pagePromise = (link) => new Promise(async (resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            let title = await newPage.$eval('.main h1', text => text.textContent)
            let content = await newPage.$eval('#content', text => text.textContent);
            // dataObj['chapterTitle'] = title;
            dataObj['chapterTitle'] = await translatePromise(title);
            // dataObj['chapterContent'] = content;
            dataObj['chapterContent'] = await translatePromise(content);
            resolve(dataObj);
            await newPage.close();
        });

        for (link in urls) {
            console.log(`Scraping ${urls[link]}`);
            let currentPageData = await pagePromise(urls[link]);
            dataArray.push(currentPageData);
            if (link == urls.length - 1) {
                console.log("================================\nScraped all the urls.\n")
            }
        }
        return dataArray;
    }
}

const scraperMtlFfxs8Object = {
    url: '',
    async scraper(browser, url) {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        let dataArray = [];
        await page.goto(url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('.info-right .catalog ul');
        // Get the link to all the required books
        console.log("Scraping all the links...");
        let urls = await page.$$eval('.info-right .catalog ul li', (links) => {
            // Extract the links from the data
            links = links.map(el => (el.querySelector('a').href))
            return links;
        });
        console.log('Links extracted.\n================================')
        // Loop through each of those links, open a new page instance and get the relevant data from them
        let pagePromise = (link) => new Promise(async (resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            let title = await newPage.$eval('.article h1', text => text.textContent)
            let content = await newPage.$eval('.article .content', text => text.textContent);
            // dataObj['chapterTitle'] = title;
            dataObj['chapterTitle'] = await translatePromise(title);
            // dataObj['chapterContent'] = content;
            dataObj['chapterContent'] = await translatePromise(content);
            resolve(dataObj);
            await newPage.close();
        });

        for (link in urls) {
            console.log(`Scraping ${urls[link]}`);
            let currentPageData = await pagePromise(urls[link]);
            dataArray.push(currentPageData);
            if (link == urls.length - 1) {
                console.log("================================\nScraped all the urls.\n")
            }
        }
        return dataArray;
    }
}

const getMtlData = async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const { url } = req.body;

    let browserInstance = startBrowser();
    const browser = await browserInstance;
    const scrapedData = await scraperMtlObject.scraper(browser, url);
    res.json(scrapedData);

    await browser.close();

}

const getMtlShoudashuData = async (req, res) => {
    let { url } = req.body;
    if (url.slice(-1) != "/") {
        url += "/";
    }
    const urlParts = url.split("/")
    const bid = urlParts[urlParts.length - 3]
    const nid = urlParts[urlParts.length - 2]

    let browserInstance = startBrowser();
    const browser = await browserInstance;
    const scrapedData = await scraperMtlShoudashuObject.scraper(browser, url, bid, nid);
    res.json(scrapedData);

    await browser.close();

}

const getMtlFfxs8Data = async (req, res) => {
    let { url } = req.body;

    let browserInstance = startBrowser();
    const browser = await browserInstance;
    const scrapedData = await scraperMtlFfxs8Object.scraper(browser, url);
    res.json(scrapedData);

    await browser.close();

}

let translatePromise = (data) =>
    translate(data, { to: 'en' }).then(res => {
        return res.text;
    }).catch(err => {
        console.error(err);
    });

const translateL = async (req, res) => {
    translate('倒地。 龙国。 深夜。 魔都。', { to: 'en' }).then(res => {
        console.log(res.text); // OUTPUT: You are amazing!
    }).catch(err => {
        console.error(err);
    });
}

module.exports = {
    getData,
    translateL,
    getShoudashuData,
    getFfxs8Data,
    getMtlData,
    getMtlShoudashuData,
    getMtlFfxs8Data
}