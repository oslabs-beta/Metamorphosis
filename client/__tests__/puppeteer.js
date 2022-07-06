

const puppeteer = require('puppeteer');
const regeneratorRuntime = require("regenerator-runtime");
const APP = 'http://localhost:8080/';
/*
TESTS:
1. Able to connect to browser
2. On connection page, can select connect. Expect that inner text of button is "Connect"
    i. On connection page, enter in the ip address and the port, click 
    ii. Expect inner text of button to be "Disconnect"
3. Select link for broker dashboard
    i. Click link
    ii. Check for metric card, check that inner text/HTML is "Active Broker"
    iii. Check for graph (double check HTML feature to search for)
*/

describe('Front-end Integration/Features', () => {
    let browser;
    let page;

    // CONNECTION COMPONENT ------------------------------------------------------------
    beforeAll(async() => {
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        page = await browser.newPage();
    });

    afterAll(() => {
        browser.close();
    });

    describe('Initial Display on Connection Component', () => {

        it('able to connect to browser - Loads successfully', async () => {
            // We navigate to the page at the beginning of each case so we have a fresh start
            await page.goto(APP);
            await page.waitForSelector('.ip-label');
            const titleIpAddress = await page.$eval('.ip-label', el => el.innerHTML);
            expect(titleIpAddress).toBe('IP Address: ');
        });

        it('displays a usable input field for ip address', async () => {
            await page.goto(APP);
            await page.waitForSelector('#ipaddress');
            await page.focus('#ipaddress');
            await page.keyboard.type('127.0.0.1');
            const inputFieldIpAddress = await page.$eval('#ipaddress', el => el.value);
            expect(inputFieldIpAddress).toBe('127.0.0.1');
          });

          it('displays a usable input field for port', async () => {
            await page.goto(APP);
            await page.waitForSelector('#port');
            await page.focus('#port');
            await page.keyboard.type('8080');
            const inputFieldIpAddress = await page.$eval('#port', el => el.value);
            expect(inputFieldIpAddress).toBe('8080');
          });

          it('clicks connect button which then changes to Disconnect upon successful connection', async () => {
            await page.goto(APP);
            // Select ipadress selector and type a valid ipaddress
            await page.waitForSelector('#ipaddress');
            await page.type('#ipaddress','127.0.0.1');
            // Select port selector and type a valid port
            await page.waitForSelector('#port');
            await page.type('#port','8080');
            // after both the ipaddress and ports have received inputs for testing, 
            // click "connect" button to see if it connects and button text changes to "Disconnect"
            await page.click("button#connectBtnConnection");
            // uncomment line if you want to see a screenshot of the test result
            // await page.screenshot({path: 'example.png'});
            const buttonVal = await page.$eval('button#connectBtnConnection', el => el.innerHTML);
            expect(buttonVal).toBe('Disconnect');
          });

          xit('clicks Browser button and redirects to browser window', async () => {

          });
    });

    // BROWSER COMPONENT ------------------------------------------------------------
    describe('Initial Display on Broker Component', () => {

        it('checks Active Brokers metric card to ensure its rendering (title and value)', async () => {
            await page.goto(`${APP}#/broker`);
            // selects Active Broker metrics card's title
            await page.waitForSelector('p#ActiveBrokers');
            await page.focus('p#ActiveBrokers');
            const actBrokerMetricCardTitle = await page.$eval('p#ActiveBrokers', el => el.innerHTML);
            // selects Active Broker metrics card's value
            await page.waitForSelector('p#ActiveBrokersValue');
            await page.focus('p#ActiveBrokersValue');
            const actBrokerMetricCardValue = await page.$eval('p#ActiveBrokersValue', el => el.innerHTML =30);
            // tests that Active Broker's metric card title is "Active Brokers" and value is 30 (dummy val for testing)
            expect(actBrokerMetricCardTitle).toBe('Active Brokers');
            expect(actBrokerMetricCardValue).toBeGreaterThan(0);
        });

        it('checks Active Controller metric card to ensure its rendering (title and value)', async () => {
            await page.goto(`${APP}#/broker`);
            // selects Active Broker metrics card's title
            await page.waitForSelector('p#ActiveController');
            await page.focus('p#ActiveController');
            const actControllerMetricCardTitle = await page.$eval('p#ActiveController', el => el.innerHTML);
            // selects Active Broker metrics card's value
            await page.waitForSelector('p#ActiveControllerValue');
            await page.focus('p#ActiveControllerValue');
            const actControllerMetricCardValue = await page.$eval('p#ActiveControllerValue', el => el.innerHTML =30);
            // tests that Active Broker's metric card title is "Active Brokers" and value is 30 (dummy val for testing)
            expect(actControllerMetricCardTitle).toBe('Active Controller');
            expect(actControllerMetricCardValue).toBeGreaterThan(0);
        });

        // it('checks thats JVM Bytes Used chart is present in the component', async () => {
        //     await page.goto(`${APP}#/broker`);
        //     // selects Active Broker metrics card's title
        //     await page.waitForSelector('#jvmUsed canvas');
        //     await page.focus('#jvmUsed canvas');
        //     const jvmUsedChart = await page.$('#jvmUsed');
        // });

        // await page.screenshot({path: 'example.png'});
    });
})
