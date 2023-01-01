const puppeteer = require('puppeteer-core')
const { executablePath } =  require('puppeteer');
const chromium =  require('chrome-aws-lambda')

const urls = []
async function click() {
const browser = await puppeteer.launch({ headless: false, executablePath: executablePath(),  args: [ ...chromium.args, '--start-maximized', '--no-sandbox'], userDataDir: '<PATH>'});
const page = await browser.newPage();
await page.setViewport({
  width: 840,
  height: 720,
  deviceScaleFactor: 1,
});
let pages
let prices = []
let newRelevantPages = []
let newpage
let newPages = []
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        console.log(urls[i])
        await page.goto(`${url}`, { waitUntil: 'networkidle2' });
        await page.click('button[data-osc-product="search-form-dates"]')
        await page.waitForTimeout(2000)
        await page.evaluate(() => {
          /*var myNodeList = document.querySelectorAll('h2[data-testid="calendar-month-header"]');
          Array.from(myNodeList).filter(function(el) {
          //console.log(el.innerText)
            if (el.innerText != 'March 2023'){*/
          Array.from(document.querySelectorAll('span')).filter(span => {
            return span.innerText == 'Next Month'
          }).forEach(element => {
            if (element) element.click();
          });
       // };
        })
        page.waitForNavigation()
        await page.waitForTimeout(4000)
        await page.click('button[id="day-1700262000000"]');
        await page.click('button[id="day-1700953200000"]');
        await page.click('path[class="stroke-text"]');
        await page.type('input[class="form-input w-full"]', 'Miami Beach');
        page.waitForNavigation()
        await page.waitForTimeout(3000)
        await page.click('button[data-osc-product="search-form-button"]')
        page.waitForNavigation()
        await page.waitForTimeout(3000)
        await page.click('button[data-osc-product="search-form-button"]')
        await page.waitForNavigation()
        await page.waitForTimeout(5000)
        newpage = await browser.pages();
        newRelevantPages = newpage[1]
                prices.push(await newRelevantPages.$$eval('[data-testid="hotel-card-content"]', (els) => els.map((el) => {
                   return {
                      company: el.querySelector('[class="text-xs text-text-alt"]').innerText,
                      hotel: el.querySelector('h3[data-testid="listViewPropertyName"]').innerText,
                      price: el.querySelector('[data-testid="priceInfo"]').innerText.replace(/\D/g, "")
                   }
                })))
    }
  let data = prices.flat(1)
  let hotels = []
    const XLSX = require('xlsx')
    let binaryWS = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Hotels')
    XLSX.writeFile(wb, 'hotels.xlsx');
}
click()
