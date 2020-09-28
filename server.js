const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const axios = require('axios');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true 
}));
app.set('view engine', ejs);

app.get('/', (req, res) => {
    let url = 'https://api.thevirustracker.com/free-api?countryTimeline=EE';

    axios.get(url).then(function(api){
        /*
        Et saada kõige viimase kuupäeva objekti, kasutasin Object.keys() funktsiooni.
        Object.keys() tekitas massiivi kasutades oma väärtusteks timelineitems[0] sees
        asuvate objektide pealkirjasid.
        Hiljem leidsin timelineitems[0] seest objektid kasutades pealkirja, mis sain
        kätte eelmist meetodit kasutades.
         */
        let title = api.data.countrytimelinedata[0].info.title;
        let source = api.data.countrytimelinedata[0].info.source;
        let timelineitemsArray = Object.keys(api.data.timelineitems[0]); 
        let firstObjTitle = timelineitemsArray[0];
        let lastObjTitle = timelineitemsArray[timelineitemsArray.length - 2];
        let firstObj = api.data.timelineitems[0][firstObjTitle];
        let lastObj = api.data.timelineitems[0][lastObjTitle];

        res.render('index.ejs', {
            title: title,
            firstHeader: firstObjTitle,
            lastHeader: lastObjTitle,
            firstNewDailyCases: firstObj.new_daily_cases,
            lastNewDailyCases: lastObj.new_daily_cases,
            firstTotalCases: firstObj.total_cases,
            lastTotalCases: lastObj.total_cases,
            firstTotalRecoveries: firstObj.total_recoveries,
            lastTotalRecoveries: lastObj.total_recoveries,
            source: source
        });
    }).catch(function(error){
        console.log(error);
    });
});

let port = 7766;
app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});