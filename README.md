# anki-review
A single-page app to review my Anki cards.

Anki (http://ankisrs.net/) is a spaced repetition flashcard program that I use a lot. Anki has a web interface but it is not easy to use to me. I decide to build my own app instead to review my cards. The project consists of a Python script to export Anki cards to a JSON file and a single-page app that gets the JSON export and lets me do review on my phone. The single-page app, built with React and Boostrap, is just HTML and Javascript files and can be easily hosted any where. In fact, my main goal is to host them from Github Pages. You can see the app at http://gineer01.github.io/anki-review/static/view.html

The single-page app allows me to review the cards while on commute, when the Internet connection is spotty. It only requires Internet connection when loading initially. After the initial load, it runs entirely in browser.

This project is not intended to replace Anki; I still use Anki on desktop. My main use case is to review my cards quickly and informally while on commute. The app does not update/sync with Anki database. If you want to update/sync with your Anki database, use AnkiWeb or Anki mobile app.

