const db = require('../utils/db').pool;

const storeData = (req, res) => {
    let { title, content, label } = req.body;
    content = "<p>" + content.replace(/\n/g, "&nbsp;</p><p>" ) + "</p>";

    const q = `INSERT INTO chapters (title, content, label) VALUES ('${title.replaceAll("'", "''")}', '${content.replaceAll("'", "''")}', '${label.replaceAll("'", "''")}');`;
    db.query(q, (err, data) => {
        if (err) return console.log(err.message);
        return res.json(`${title} of ${label} inserted successfully!`);
    })
}

const getAllData = (req, res) => {
    const q = `SELECT * FROM chapters ORDER BY label ASC, nullif(regexp_replace(title, '[^0-9]', '', 'g'),'')::int;`
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return console.log(err.message);
        let resultRes = data.rows;
        return res.json(resultRes.reverse());
    })
}

const getSingleData = async (req, res) => {
    const { id } = req.params;
    const q = `SELECT * FROM chapters WHERE id=${id};`
    console.log(q);
    db.query(q, (err, data) => {
        if (err) return console.log(err.message);
        return res.json(data.rows[0]);
    })
}

const getLabelData = (req, res) => {
    let { label } = req.query;
    if (label) { label = label.replaceAll("'", "''"); }
    const q = `SELECT * FROM chapters WHERE label='${label}' ORDER BY label ASC, nullif(regexp_replace(title, '[^0-9]', '', 'g'),'')::int;`
    db.query(q, (err, data) => {
        if (err) return console.log(err.message);
        return res.json(data.rows.reverse());
    })
}

const updateData = (req, res) => {
    const { title, content, label } = req.body;
    const q = `UPDATE chapters SET title='${title.replaceAll("'", "''")}', content='${content.replaceAll("'", "''")}', label='${label.replaceAll("'", "''")}' WHERE id=${req.params.id};`
    db.query(q, (err, data) => {
        if (err) return console.log(err.message);
        return res.json(`${title} of ${label} updated successfully!`);
    })
}

module.exports = {
    storeData,
    getAllData,
    getSingleData,
    getLabelData,
    updateData
}