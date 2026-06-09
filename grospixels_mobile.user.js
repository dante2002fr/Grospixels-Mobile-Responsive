// ==UserScript==
// @name         Grospixels Mobile Framework
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Modernisation globale du forum pour iPhone (Accueil, Sujets, Posts)
// @author       Jonathan Kler
// @match        *://*.grospixels.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Injection du viewport pour forcer le rendu mobile sur iOS Safari
    const injectViewport = () => {
        if (!document.querySelector('meta[name="viewport"]')) {
            const meta = document.createElement('meta');
            meta.name = "viewport";
            meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
            document.head.appendChild(meta);
        }
    };

    injectViewport();
    document.addEventListener('DOMContentLoaded', injectViewport);

    // 2. Injection du CSS Responsive global
    GM_addStyle(`
        /* ==========================================================================
           1. RESET & CONTENEURS GLOBAUX
           ========================================================================== */
        html, body {
            width: 100% !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 15px !important;
            background-image: none !important;
            background-color: #f0f2f5 !important;
            color: #333 !important;
        }

        .forum_position, .contenu, .essentiel, .backtable, .head, .tail, .pagediv, form {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
        }

        img {
            max-width: 100% !important;
            height: auto !important;
        }

        a {
            text-decoration: none !important;
            display: inline-block !important;
            min-height: 24px !important;
            word-wrap: break-word !important;
        }

        /* ==========================================================================
           2. ENTÊTE (HEADER) ET MENU
           ========================================================================== */
        .head table, .head tbody, .head tr, .head td {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            box-sizing: border-box !important;
            background: transparent !important;
        }

        .head {
            background-color: #fff !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
            margin-bottom: 10px !important;
        }

        .head tr:first-child td {
            min-height: 60px !important;
            text-align: center !important;
        }
        
        .head table:last-child {
            padding: 10px !important;
        }
        .head table:last-child td {
            text-align: center !important;
            padding: 10px 0 !important;
            border-bottom: 1px solid #eee !important;
        }
        .head table:last-child td:last-child {
            border-bottom: none !important;
        }

        /* Pagination */
        .pagediv, .pages {
            text-align: center !important;
            padding: 15px 5px !important;
        }
        .pages a, .pages span {
            display: inline-block !important;
            padding: 12px 18px !important;
            margin: 3px !important;
            font-size: 16px !important;
            background-color: #e4e6eb !important;
            border-radius: 8px !important;
            border: none !important;
            color: #333 !important;
        }
        .pages span {
            background-color: #006eaf !important;
            color: #fff !important;
            font-weight: bold !important;
        }

        /* ==========================================================================
           3. STRUCTURES EN TABLEAU -> CARTES FLEX
           ========================================================================== */
        table, tbody {
            display: block !important;
            width: 100% !important;
            border: none !important;
        }

        tr {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            box-sizing: border-box !important;
            margin-bottom: 10px !important;
            background: #ffffff !important;
            border-radius: 8px !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }

        td, th {
            display: block !important;
            width: 100% !important;
            text-align: left !important;
            box-sizing: border-box !important;
            padding: 12px 15px !important;
            border: none !important;
        }

        tr.hat:first-child, th {
            display: none !important;
        }

        /* ==========================================================================
           4. LISTE DES FORUMS & SUJETS (Accueil & viewforum.php)
           ========================================================================== */
        table.forum tr, table.topic tr {
            padding: 0 !important;
        }

        table.forum tr.hat {
            background-color: transparent !important;
            box-shadow: none !important;
            margin: 20px 10px 5px 10px !important;
            border-bottom: 2px solid #ccc !important;
            border-radius: 0 !important;
            display: block !important;
        }
        table.forum tr.hat td {
            font-size: 16px !important;
            font-weight: 800 !important;
            color: #555 !important;
            text-transform: uppercase !important;
            padding: 5px 0 !important;
        }

        /* Masquer uniquement les icônes de type dossier sur la liste des forums/sujets */
        table.forum td.C1S2:first-child, table.topic td.C1S2:first-child {
            display: none !important;
        }

        /* Stylisation des titres et descriptions */
        table.forum td a, table.topic td a.gen {
            font-size: 18px !important;
            font-weight: bold !important;
            color: #006eaf !important;
            margin-bottom: 5px !important;
            line-height: 1.3 !important;
        }
        
        .small {
            font-size: 14px !important;
            color: #666 !important;
            line-height: 1.4 !important;
        }

        /* Info 'Dernier Message' */
        td.C1S1, td.C2S1 {
            background-color: #f9f9f9 !important;
            font-size: 13px !important;
            color: #777 !important;
            padding: 10px 15px !important;
        }

        /* ==========================================================================
           5. LECTURE DES MESSAGES (viewtopic.php)
           ========================================================================== */
        .message {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            font-size: 16px !important;
            line-height: 1.5 !important;
            color: #222 !important;
        }

        /* Zone d'information de l'auteur (Cellule 1 dans viewtopic.php) */
        table.topic tr:not(.hat) td:first-child {
            background: #f0f2f5 !important;
            border-bottom: 1px solid #e4e6eb !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            flex-wrap: wrap !important;
            padding: 12px 15px !important;
        }

        /* Zone de contenu du message (Cellule 2 dans viewtopic.php) */
        table.topic tr:not(.hat) td:nth-child(2) {
            background: #ffffff !important;
            padding: 15px !important;
        }

        /* Pseudo */
        span.big b, .name {
            font-size: 18px !important;
            color: #006eaf !important;
            margin-right: 15px !important;
        }

        /* Avatar en mode mobile */
        .avatar {
            margin: 0 15px 0 0 !important;
            border: none !important;
        }
        .avatar img {
            width: 40px !important;
            height: 40px !important;
            border-radius: 50% !important;
            margin: 0 !important;
        }

        /* Masquer certains détails superflus de l'auteur sur mobile */
        table.topic tr:not(.hat) td:first-child br,
        table.topic tr:not(.hat) td:first-child img[src*="grade"] {
            display: none !important; /* Cache les retours à la ligne et les petites barres de grade */
        }

        /* Citations et code */
        .quoteA, .quoteB, .codeA, .codeB {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            margin: 10px 0 !important;
            border-radius: 6px !important;
        }
        .quoteB {
            background-color: #eef2f5 !important;
            border-left: 4px solid #006eaf !important;
            border-top: none !important;
            border-right: none !important;
            border-bottom: none !important;
            padding: 15px !important;
            font-style: italic !important;
            color: #555 !important;
            max-height: none !important;
        }

        /* ==========================================================================
           6. FORMULAIRES (posting.php / login.php)
           ========================================================================== */
        input[type="text"], input[type="password"], textarea, select {
            font-size: 16px !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            padding: 15px !important;
            border-radius: 8px !important;
            border: 1px solid #ccc !important;
            margin-bottom: 15px !important;
            background-color: #fff !important;
            appearance: none !important;
        }

        textarea.post {
            min-height: 250px !important;
        }

        button, input[type="submit"], input[type="reset"], input[type="button"] {
            min-height: 50px !important;
            padding: 12px 20px !important;
            font-size: 18px !important;
            font-weight: bold !important;
            border-radius: 8px !important;
            box-sizing: border-box !important;
            width: 100% !important;
            margin: 8px 0 !important;
            background-color: #006eaf !important;
            color: #fff !important;
            border: none !important;
            appearance: none !important;
        }
    `);
})();
