var describe = require ('mocha').describe;
var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = chai.assert;
var EmailConfig = require("../models/email_config");
describe("Pug renderer tester", () => {
    it("Test compile email config", (done) => {
        let cf = new EmailConfig({
            to : "|abc@gmail.com",
            from : "|#{from}",
            subject : "|Email for #{reason}",
            template : "p Cntent of email \t\t #{data.message}\n a(href=\"\" + data.link) Link"
        });

        const scope = {
            from : "a@test.com",
            reason : "Testing",
            data : {
                message : "Message message",
                link : "sample link"
            }
        };

        const o = cf.compile(scope);

        assert.equal(o.to, "abc@gmail.com");
        assert.equal(o.from, "a@test.com");
        assert.equal(o.subject, "Email for Testing");
        assert.equal(o.html, "<p>Cntent of email \t\t Message message<a href=\"sample link\">Link</a></p>");

        done();
    })
})