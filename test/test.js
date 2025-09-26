var val = require('../libs/unalib');
var assert = require('assert');


describe('unalib', function(){


  describe('funcion is_valid_phone', function(){

    it('deberia devolver true para 8297-8547', function(){

      assert.equal(val.is_valid_phone('8297-8547'), true);

    });

    it('deberia devolver false para 8297p-8547', function(){

      assert.equal(val.is_valid_phone('8297p-8547'), false);

    });

  });


  describe('funcion is_valid_url_image', function(){

    it('deberia devolver true para http://image.com/image.jpg', function(){

      assert.equal(val.is_valid_url_image('http://image.com/image.jpg'), true);

    });

    it('deberia devolver true para http://image.com/image.gif', function(){

      assert.equal(val.is_valid_url_image('http://image.com/image.gif'), true);

    });

    it('deberia devolver true para https://example.com/image.png', function(){

      assert.equal(val.is_valid_url_image('https://example.com/image.png'), true);

    });

    it('deberia devolver true para https://example.com/image.webp', function(){

      assert.equal(val.is_valid_url_image('https://example.com/image.webp'), true);

    });

    it('deberia devolver false para texto normal', function(){

      assert.equal(val.is_valid_url_image('esto es solo texto'), false);

    });

    it('deberia devolver false para URL sin extension de imagen', function(){

      assert.equal(val.is_valid_url_image('https://example.com/page'), false);

    });
    
  });

  describe('funcion is_valid_yt_video', function(){

    it('deberia devolver true para URL de YouTube watch', function(){

      assert.equal(val.is_valid_yt_video('https://www.youtube.com/watch?v=qYwlqx-JLok'), true);

    });

    it('deberia devolver true para URL corta de YouTube', function(){

      assert.equal(val.is_valid_yt_video('https://youtu.be/qYwlqx-JLok'), true);

    });

    it('deberia devolver false para URL que no es de YouTube', function(){

      assert.equal(val.is_valid_yt_video('https://example.com/video'), false);

    });

  });

  describe('funcion is_valid_video_url', function(){

    it('deberia devolver true para URL de video MP4', function(){

      assert.equal(val.is_valid_video_url('https://example.com/video.mp4'), true);

    });

    it('deberia devolver true para URL de video WebM', function(){

      assert.equal(val.is_valid_video_url('https://example.com/video.webm'), true);

    });

    it('deberia devolver false para URL que no es video', function(){

      assert.equal(val.is_valid_video_url('https://example.com/page.html'), false);

    });

  });

  describe('funcion sanitizeText', function(){

    it('deberia eliminar scripts maliciosos', function(){

      var maliciousScript = '<script>alert("XSS")</script>Texto normal';
      var sanitized = val.sanitizeText(maliciousScript);
      assert.equal(sanitized, 'Texto normal');

    });

    it('deberia eliminar event handlers', function(){

      var maliciousCode = '<img src="x" onerror="alert(1)">Texto';
      var sanitized = val.sanitizeText(maliciousCode);
      assert.equal(sanitized.includes('onerror'), false);

    });

    it('deberia eliminar javascript: URLs', function(){

      var maliciousCode = '<a href="javascript:alert(1)">Link</a>';
      var sanitized = val.sanitizeText(maliciousCode);
      assert.equal(sanitized.includes('javascript:'), false);

    });

    it('deberia mantener texto normal', function(){

      var normalText = 'Este es un texto normal sin scripts';
      var sanitized = val.sanitizeText(normalText);
      assert.equal(sanitized, normalText);

    });

  });

  describe('funcion validateMessage', function(){

    it('deberia procesar imagen correctamente', function(){

      var imageMsg = JSON.stringify({nombre: 'Test', mensaje: 'https://example.com/image.jpg'});
      var result = JSON.parse(val.validateMessage(imageMsg));
      assert.equal(result.mensaje.includes('<img'), true);

    });

    it('deberia procesar video de YouTube correctamente', function(){

      var videoMsg = JSON.stringify({nombre: 'Test', mensaje: 'https://www.youtube.com/watch?v=qYwlqx-JLok'});
      var result = JSON.parse(val.validateMessage(videoMsg));
      assert.equal(result.mensaje.includes('<iframe'), true);

    });

    it('deberia sanitizar script malicioso', function(){

      var maliciousMsg = JSON.stringify({nombre: 'Test', mensaje: '<script>alert("XSS")</script>'});
      var result = JSON.parse(val.validateMessage(maliciousMsg));
      assert.equal(result.mensaje.includes('<script'), false);

    });

    it('deberia sanitizar nombre con script malicioso', function(){

      var maliciousMsg = JSON.stringify({nombre: '<script>alert("XSS")</script>Hacker', mensaje: 'Mensaje normal'});
      var result = JSON.parse(val.validateMessage(maliciousMsg));
      assert.equal(result.nombre.includes('<script'), false);
      assert.equal(result.nombre, 'Hacker');

    });

    it('deberia procesar video directo correctamente', function(){

      var videoMsg = JSON.stringify({nombre: 'Test', mensaje: 'https://example.com/video.mp4'});
      var result = JSON.parse(val.validateMessage(videoMsg));
      assert.equal(result.mensaje.includes('<video'), true);

    });

  });

});







