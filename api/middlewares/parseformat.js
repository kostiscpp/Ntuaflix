const { Parser } = require('json2csv');

const parseFormat = (req, res, next) => {
    const originalSend = res.send;

    res.send = function(data) {
        if (req.query.format === 'csv') {
            try {
                // Assume data is JSON and convert it to CSV
                const json = typeof data === 'object' ? data : JSON.parse(data);
                const parser = new Parser();
                const csv = parser.parse(json);

                res.set('Content-Type', 'text/csv');
                res.attachment('data.csv');
                originalSend.call(this, csv);
            } catch (err) {
                console.error('Error in converting JSON to CSV:', err);
                // Proceed with original JSON if conversion fails
                console.log(data);
                originalSend.call(this, data);
            }
        } else {
            // Proceed with original response if format is not CSV
            originalSend.call(this, data);
        }
    };

    next();
};
module.exports = parseFormat;