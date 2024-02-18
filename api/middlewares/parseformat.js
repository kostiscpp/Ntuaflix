const { Parser } = require('json2csv');

const parseFormat = (req, res, next) => {
    const originalSend = res.send;

    res.send = function(data) {
        if (req.query.format === 'csv') {
            try {
                // Assume data is JSON and convert it to CSV
                var json = typeof data === 'object' ? data : JSON.parse(data);
                if (!Array.isArray(json)) {
                    json = [json];
                }
                let  count = 0;
                for (var key in json[0]) {
                    if (typeof json[0].key === 'object') {
                        count++;
                    }
                }
                let maxlen = Array(count).fill(0);
                for (var i = 0; i < json.length; i++) {
                    let j = 0;
                    for (var key in json[i]) {
                        if (typeof json[i].key === 'object') {
                            maxlen[j] = Math.max(maxlen[j], json[i][key].length);
                            ++j;
                        }
                        
                    }
                }
                for (var i = 0; i < json.length; i++) {
                    let j = 0;
                    for (var key in json[i]) {
                        if (typeof json[i].key === 'object') {
                            if (json[i][key].length < maxlen[j]) {
                                for (var k = json[i][key].length; k < maxlen[j]; k++) {
                                    json[i][key][k] = null;
                                }
                            }
                            ++j;
                        }
                    }
                
                }

                for (var i = 0; i < json.length; i++) {
                    json[i] = flatten(json[i]);
                }

                for (var i = 0; i < json.length; i++) {
                    for (var key in json[i]) {
                        if (Array.isArray(json[i][key])) {
                            json[i][key] = json[i][key].join(',');
                        }
                    }
                }
                console.log(json);

                console.log(json);
                const parser = new Parser();
                const csv = parser.parse(json);
                
                
                res.set('Content-Type', 'text/csv');
                res.attachment('data.csv');
                originalSend.call(this, csv);
            } catch (err) {
                console.error('Error in converting JSON to CSV:', err);
                // Proceed with original JSON if conversion fails
                //console.log(data);
                originalSend.call(this, data);
            }
        } else {
            // Proceed with original response if format is not CSV
            originalSend.call(this, data);
        }
    };

    next();
};

function flatten(data) {
    let result = {};

    function recurse(cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            let l = cur.length;
             for(let i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop + "_" + (i+1));
            if (l == 0)
                result[prop] = [];
        } else {
            let isEmpty = true;
            for (let p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"_"+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }

    recurse(data, "");
    return result;
}

module.exports = parseFormat;
