// modulo de ejemplo.

module.exports = {


    // logica que valida si un telefono esta correcto...
    is_valid_phone: function (phone) {
      // inicializacion lazy
      var isValid = false;
      // expresion regular copiada de StackOverflow
      var re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/i;
  
      // validacion Regex
      try {
        isValid = re.test(phone);
      } catch (e) {
        console.log(e);
      } finally {
          return isValid;
      }
      // fin del try-catch block
    },
  
    is_valid_url_image: function (url) {
  
      // inicializacion lazy
      var isValid = false;
      // expresion regular mejorada para mas formatos de imagen - mas flexible
      var re = /^https?:\/\/.+\.(?:jpg|jpeg|gif|png|bmp|webp|svg)(?:\?.*)?$/i;
  
      // validacion Regex
      try {
        isValid = re.test(url);
        console.log('Testing image URL:', url, 'Result:', isValid);
      } catch (e) {
        console.log(e);
      } finally {
          return isValid;
      }
      // fin del try-catch block
    },
  
    is_valid_yt_video: function (url) {
  
      // inicializacion lazy
      var isValid = false;
      // expresion regular mejorada para YouTube
      var re = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/i;
  
      // validacion Regex
      try {
        isValid = re.test(url);
      } catch (e) {
        console.log(e);
      } finally {
          return isValid;
      }
      // fin del try-catch block
    },

    // Nueva funcion para detectar videos de otras plataformas
    is_valid_video_url: function (url) {
      var isValid = false;
      // Detecta videos de MP4, WebM, AVI directos
      var re = /^https?:\/\/.*\.(?:mp4|webm|avi|mov|wmv|flv)(?:\?.*)?$/i;
      
      try {
        isValid = re.test(url);
      } catch (e) {
        console.log(e);
      } finally {
          return isValid;
      }
    },
  
    getYTVideoId: function(url){
  
      return url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)[1];
    },
  
    getEmbeddedCode: function (url){
      var id = this.getYTVideoId(url);
      var code = '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+id+ '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      return code;
    },
  
    getImageTag: function(url){
      var tag = '<img src="'+url+'" style="max-width: 300px; max-height: 200px; display: block; margin: 5px 0;">';
      console.log('Generated image tag:', tag);
      return tag;
    },

    getVideoTag: function(url){
      var tag = '<video controls style="max-height: 400px;max-width: 400px;" preload="metadata"><source src="'+url+'" type="video/mp4">Tu navegador no soporta el elemento video.</video>';
      return tag;
    },
  
    // Function to sanitize text and prevent XSS attacks
    sanitizeText: function(text) {
      if (!text || typeof text !== 'string') {
        return '';
      }
      
      var originalText = text;
      var maliciousDetected = false;
      var maliciousTypes = [];
      
      // Detect and remove script tags
      if (/<script[^>]*>/gi.test(text)) {
        maliciousDetected = true;
        maliciousTypes.push('SCRIPT');
      }
      
      // Detect JavaScript URLs
      if (/javascript:/gi.test(text)) {
        maliciousDetected = true;
        maliciousTypes.push('JAVASCRIPT_URL');
      }
      
      // Detect event handlers
      if (/on\w+\s*=/gi.test(text)) {
        maliciousDetected = true;
        maliciousTypes.push('EVENT_HANDLER');
      }
      
      // Detect dangerous elements
      if (/<(iframe|object|embed|applet|meta|link|style)[^>]*>/gi.test(text)) {
        maliciousDetected = true;
        maliciousTypes.push('DANGEROUS_ELEMENT');
      }
      
      // Remove all malicious content
      var sanitized = text
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<script[^>]*>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<iframe[^>]*>/gi, '')
        .replace(/<\/iframe>/gi, '')
        .replace(/<object[^>]*>/gi, '')
        .replace(/<\/object>/gi, '')
        .replace(/<embed[^>]*>/gi, '')
        .replace(/<\/embed>/gi, '')
        .replace(/<applet[^>]*>/gi, '')
        .replace(/<\/applet>/gi, '')
        .replace(/<meta[^>]*>/gi, '')
        .replace(/<link[^>]*>/gi, '')
        .replace(/<style[^>]*>.*?<\/style>/gi, '')
        .replace(/expression\s*\(/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/data:/gi, '');
      
      // If malicious content was detected, add warning message
      if (maliciousDetected) {
        console.log('🚨 CONTENIDO MALICIOSO DETECTADO:', maliciousTypes.join(', '));
        console.log('Texto original:', originalText);
        console.log('Texto sanitizado:', sanitized);
        
        var warningMsg = '<span style="color: red; font-weight: bold;">⚠️ CONTENIDO MALICIOSO BLOQUEADO (' + maliciousTypes.join(', ') + ')</span><br>' + sanitized;
        return warningMsg;
      }
        
      return sanitized;
    },

    validateMessage: function(msg){
      // Handle invalid input
      if (!msg || typeof msg !== 'string') {
        return JSON.stringify({ mensaje: '' });
      }

      try {
        var obj = JSON.parse(msg);
        
        // Sanitize the name field to prevent XSS
        if (obj.nombre) {
          var originalName = obj.nombre;
          obj.nombre = this.sanitizeText(obj.nombre);
          // If the name contained malicious content, log it
          if (originalName !== obj.nombre && obj.nombre.includes('MALICIOSO BLOQUEADO')) {
            console.log('🚨 NOMBRE DE USUARIO MALICIOSO DETECTADO:', originalName);
          }
        }
  
        if(this.is_valid_url_image(obj.mensaje)){
          console.log("Es una imagen!")
          obj.mensaje = this.getImageTag(obj.mensaje);
          console.log('Final message after processing:', JSON.stringify(obj));
        }
        // Para debugging - detectar si alguien escribe "test-image"
        else if(obj.mensaje === 'test-image'){
          console.log("Usando imagen de prueba!")
          obj.mensaje = '<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwN2ZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRFU1QgSU1BR0U8L3RleHQ+Cjwvc3ZnPg==" style="max-width: 200px;">';
        }
        else if(this.is_valid_yt_video(obj.mensaje)){
          console.log("Es un video de YouTube!")
          obj.mensaje = this.getEmbeddedCode(obj.mensaje);
        }
        else if(this.is_valid_video_url(obj.mensaje)){
          console.log("Es un video directo!")
          obj.mensaje = this.getVideoTag(obj.mensaje);
        }
        else{
          console.log("Es un texto!")
          // Sanitize regular text messages to prevent XSS
          obj.mensaje = this.sanitizeText(obj.mensaje);
        }
        
        return JSON.stringify(obj);
      } catch (e) {
        console.log('Error processing message:', e);
        return JSON.stringify({ mensaje: this.sanitizeText(msg) }); // Return sanitized message on error
      }
    }
  
  
  
    
    
  
  // fin del modulo
  };
  