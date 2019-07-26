var pug = require("pug");

/**
 * example of compilable values :
 * |string
 * |string with #{varible}
 * |string with #{object.akey}
 * p html code a(href="" + link) Link
 *
 * See testPugRenderer.js for more example
 *
 * @param input
 * @param id
 * @constructor
 */
function EmailConfig(input, id) {
    this._to = input.to || null;
    this._cc = input.cc || null;
    this._from = input.from || null;
    this._subject = input.subject || null;
    if (id) {
        this._id = id;
    }
    this._template = input.template || null;
}

EmailConfig.prototype.compile = function(scope) {
    let result = {
        from : pug.render(this._from, scope),
        subject : pug.render(this._subject, scope),
        html : pug.render(this._template, scope)
    };
    let to;
    if (typeof this._to === "string" ) {
        to = pug.render(this._to, scope);
    } else if (Array.isArray(this._to)) {
        to = [];
        for (let email of this._to) {
            to.push(pug.render(email));
        }
    }

    result.to = to;

    let cc;
    if (this._cc !== null) {
        if (typeof this._cc === "string") {
            cc = pug.render(this._cc, scope);
        } else if (Array.isArray(this._cc)) {
            cc = [];
            for (let email of this._cc) {
                cc.push(pug.render(email));
            }
        }
        if (cc) {
            result.cc = cc;
        }
    }
    return result;
};

EmailConfig.prototype.collectionName = "email_configs";


module.exports = EmailConfig;