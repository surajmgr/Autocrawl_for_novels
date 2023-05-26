const db = require('../utils/db').pool;
const { google } = require('googleapis');
const fs = require('fs');

// Each API may support multiple versions. With this sample, we're getting
// v3 of the blogger API, and using an API key to authenticate.

const params = {
    blogId: '3213900'
};

const oauth2Client = new google.auth.OAuth2(
    process.env.outh_client_id,
    process.env.outh_client_secret,
    'http://localhost:3000'
);

const blogger = google.blogger({
    version: 'v3',
    auth: oauth2Client
});

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
    'https://www.googleapis.com/auth/blogger',
    'https://www.googleapis.com/auth/calendar'
];

const getAuth = (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope you can pass it as a string
        scope: scopes
    });
    // console.log(token);
    console.log(url);
    res.json(url);
}

const setAuth = async (req, res) => {
    const { code } = req.query;
    console.log(code);
    if (code !== undefined) {
        const { tokens } = await oauth2Client.getToken(code)
        console.log(tokens);
        oauth2Client.setCredentials(tokens);
        res.json("Authorization completed successfully!")
    }
}

const postData = async (req, res) => {
    const { title, content, label } = req.body;
    console.log('Posting data', title);
    blogger.posts.insert({
        auth: oauth2Client,
        "blogId": "9200208512907772885",
        "isDraft": true,
        "resource": {
            "content": content,
            "title": title,
            "labels": [
                "Project",
                "Chapter",
                `${label}`
            ]
        }
    })
        .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            // console.log("Response", response);
            res.json(`Chapter posted with id ${response.data.id}`);
        },
            function (err) { res.json(err.message) });

}

const autoPostAll = (req, res) => {
    const { label } = req.body;
    const q = `SELECT * FROM chapters WHERE label='${label}' ORDER BY label ASC, nullif(regexp_replace(title, '[^0-9]', '', 'g'),'')::int;`;
    db.query(q, (err, data) => {
        if (err) {
            console.log(err);
        }
        const resPonse = data.rows;
        resPonse.map(ch => {
            blogger.posts.insert({
                auth: oauth2Client,
                "blogId": "7929804715056040781",
                "isDraft": true,
                "resource": {
                    "content": ch.content,
                    "title": ch.title,
                    "labels": [
                        "Project",
                        "Chapter",
                        `${ch.label}`
                    ]
                }
            })
                .then(function (response) {
                    // Handle the results here (response.result has the parsed body).
                    // console.log("Response", response);
                    console.log(`Chapter posted with id ${response.data.id}`);
                },
                    function (err) { res.json(err.message) });
        });
        // res.json(`Chapters posted with label ${label}`);
    });
}

const xmlResponse = (req, res) => {
    let xmlVar = `<?xml version='1.0' encoding='UTF-8'?>
    <ns0:feed
        xmlns:ns0="http://www.w3.org/2005/Atom">
        <ns0:title type="html">Any Theme</ns0:title>
        <ns0:generator>Blogger</ns0:generator>
        <ns0:link href="http://www.sneeit.com" rel="self" type="application/atom+xml" />
        <ns0:link href="http://www.sneeit.com" rel="alternate" type="text/html" />
        <ns0:updated>2023-05-16T18:21:36Z</ns0:updated>
    `;

    const q = `SELECT * FROM chapters WHERE label = 'Fabricated Diary System';`;
    db.query(q, (err, data) => {
        if (err) {
            console.log(err);
        }
        const resPonse = data.rows;
        resPonse.map(row => {
            xmlVar += `<ns0:entry>
            <ns0:category scheme="http://www.blogger.com/atom/ns#" term="Fabricated Diary System" />
            <ns0:category scheme="http://schemas.google.com/g/2005#kind" term="http://schemas.google.com/blogger/2008/kind#post" />
            <ns0:id>post-10</ns0:id>
            <ns0:author>
                <ns0:name>Tien Nguyen</ns0:name>
            </ns0:author>
            <ns0:content type="html">
            ${row.content}
            </ns0:content>
            <ns0:published>2023-05-09T21:58:47Z</ns0:published>
            <ns0:title type="html">${row.title}</ns0:title>
            <ns0:link href="http://www.sneeit.com/?p=10" rel="self" type="application/atom+xml" />
            <ns0:link href="http://www.sneeit.com/?p=10" rel="alternate" type="text/html" />
        </ns0:entry>`
        })

        fs.writeFile("../utils", `${xmlVar}</ns0:feed>`, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        res.json(`${xmlVar}</ns0:feed>`)
    })
}


module.exports = {
    postData,
    getAuth,
    xmlResponse,
    setAuth,
    autoPostAll
}