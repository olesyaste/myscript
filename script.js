const puppeteer = require('puppeteer');
const urls = [];
(async () => {
const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], userDataDir: '<PATH>'});

const page = await browser.newPage();
let pages
let prices = []
let newRelevantPages
let newPages
    for (let i = 0; i <= urls.length; i++) {
        const url = urls[i];
        console.log(urls[i])
        await page.goto(`${url}`, { waitUntil: 'networkidle2' });
        await page.type('#whereSayt', 'Dubai');
        await page.$eval('#arrival', el => el.value = '01/22/2023');
        await page.$eval('#departure', el => el.value = '01/26/2023');
        await page.click('#booking-submit');
        pages = await browser.pages();
        await page.waitForTimeout(3000)
        newRelevantPages = await pages.splice(2)
        console.log(newRelevantPages)
        for (newPage of newRelevantPages){
           await newPage.bringToFront({waitUntil: 'networkidle2'})
        }
        await pages[1].bringToFront({waitUntil: 'networkidle2'})

    }
    for (p of newRelevantPages) {
              prices.push(await p.$$eval('[data-testid="hotel-card-content"]', (els) => els.map((el) => {
                 return {
                    company: el.querySelector('[class="text-xs text-text-alt"]').innerText,
                    hotel: el.querySelector('[data-testid="listViewPropertyName"]').innerText,
                    price: el.querySelector('[class="text-primary font-bold numeric-tabular-nums leading-none rtl:text-left text-lg md:text-xl"]').innerText.replace(/\D/g, "")
                         }
              })))
    }
  let data = prices.flat(1)
  let hotels = []
  console.log(data)
  Promise.all(newRelevantPages).then(() => {
        browser.close();
  })
    const XLSX = require('xlsx')
    let binaryWS = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Hotels')
    XLSX.writeFile(wb, 'hotels.xlsx');
})
()
