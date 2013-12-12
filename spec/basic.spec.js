var app = require('../index');

describe('A basic gopher app', function() {
    it('creates an express app with expected default config', function(done) {
        expect(app.get('port')).toBe(3000);
        expect(app.get('gopher.autostart')).toBeTruthy();
        setTimeout(function() {
            app.httpServer.close();
            done();
        },10);
    });
});