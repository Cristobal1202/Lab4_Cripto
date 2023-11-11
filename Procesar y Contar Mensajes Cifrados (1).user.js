// ==UserScript==
// @name         Procesar y Contar Mensajes Cifrados
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Convierte el texto a UTF-8, extrae mayúsculas, cuenta y muestra mensajes cifrados.
// @author       You
// @match        https://cripto.tiiny.site/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#sha512=E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==
// ==/UserScript==

(function() {
    'use strict';

    // Espera a que CryptoJS esté cargado
    function waitForCryptoJS(callback) {
        if (typeof CryptoJS === 'undefined') {
            setTimeout(function () {
                waitForCryptoJS(callback);
            }, 100);
        } else {
            callback();
        }
    }

    waitForCryptoJS(function () {
        // Tu código aquí

        // Obtén el párrafo actual
        var parrafo = document.querySelector('p');

        // Obtén el texto dentro del párrafo
        var textoOriginal = parrafo.textContent;

        // Convierte a UTF-8
        var textoUTF8 = decodeURIComponent(escape(textoOriginal));

        // Reemplaza el texto dentro del párrafo
        parrafo.textContent = textoUTF8;

        // Extrae las mayúsculas
        var mayusculas = textoUTF8.match(/[A-ZÁÉÍÓÚÜÑ]/g).join('');

        // Muestra el resultado en la consola
        console.log('Mayúsculas encontradas:', mayusculas);

        // Cuenta los mensajes cifrados
        var mensajesCifrados = document.querySelectorAll('[class^="M"]'); // Selecciona elementos cuyas clases comiencen con 'M'
        var cantidadMensajesCifrados = mensajesCifrados.length;

        // Muestra la cantidad de mensajes cifrados por consola
        console.log('Cantidad de mensajes cifrados:', cantidadMensajesCifrados);

        // Descifra y muestra todos los mensajes cifrados
        var mensajesDescifrados = [];
        mensajesCifrados.forEach(function(mensajeCifrado) {
            var mensajeCifradoUtf8 = mensajeCifrado.id; // Obtén el mensaje cifrado en formato UTF-8 desde el id
            var mensajeDescifrado3DES = CryptoJS.TripleDES.decrypt(
                mensajeCifradoUtf8,
                CryptoJS.enc.Utf8.parse(mayusculas),
                {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                }
            ).toString(CryptoJS.enc.Utf8);

            console.log('Mensaje cifrado:', mensajeCifradoUtf8);
            console.log('Mensaje descifrado:', mensajeDescifrado3DES);

            mensajesDescifrados.push(mensajeDescifrado3DES);

            // Agrega el mensaje descifrado al elemento actual en el sitio web
            mensajeCifrado.textContent = mensajeDescifrado3DES;
        });

        // Imprime el mensaje descifrado con espacio entre cada mensaje
        var mensajeConcatenadoConEspacios = mensajesDescifrados.join(' ');
        console.log('Mensaje descifrado con espacios:', mensajeConcatenadoConEspacios);
    });
})();
