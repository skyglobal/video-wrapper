document.body.innerHTML = __html__['_site/index.html'];
function appendCSS(fileObj){
    var  link = document.createElement('link'); link.rel = 'stylesheet'; link.href='base/' + fileObj.path;  document.body.appendChild(link)
}
appendCSS({path: '_site/styles/demo.css'});
appendCSS({path: '_site/styles/video-wrapper.css'});

var video = skyComponents['video-wrapper'];

describe('video component', function () {

    it('sum an array of numbers', function () {

        expect(true).toBe(true);

    });


    it('will play the video when play is clicked', function () {


    });

    it('will stop + fade out when the ad and video have played', function () {

    });

    it('will stop + fade out when the close button is clicked', function () {

    });

    it('will stop + fade out when the video finishes', function () {

    });

});
