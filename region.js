const cheerio = require('cheerio');
const superagent = require('superagent');
const charset = require("superagent-charset");
const request = charset(superagent);

const SERVER = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2017/'

const list = [];

function getHtml(url) {
    return new Promise((resolve)=>{
        superagent.get(url).charset('GBK').end((err, res) => {
            resolve(res.text);
        });
    });
}

async function getCityPage(url, type) {
    const text = await getHtml(url);
    const $ = cheerio.load(text);
    $(`.${type}tr`).each((index, el) => {
        const a = $(el).children().last().find('a');
        const name = a.text();
        const code = a.attr('href').replace(/.*\/(\d+).html/, '$1');
        list.push({ name, code });
    });
    console.log(list);
}

async function getCountyPage(url, type) {
    const text = await getHtml(url);
    const $ = cheerio.load(text);
    $(`.${type}tr`).each((index, el) => {
        const a = $(el).children().last().find('a');
        const name = a.text();
        const code = a.attr('href').replace(/.*\/(\d+).html/, '$1');
        list.push({ name, code });
    });
    console.log(list);
}

// getCityPage(`${SERVER}13.html`, 'city');
getCountyPage(`${SERVER}13/1301.html`, 'county');
