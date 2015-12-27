import anki
import json
import os
import re

col = anki.Collection("/Users/cdong/Dropbox/cdong-ltm1/Anki/cdong/collection.anki2")

styleTag = re.compile("(?i)<style>.*?</style>")
def escapeText(text):
    "Escape newlines, tabs, CSS and quotechar."
    # fixme: we should probably quote fields with newlines
    # instead of converting them to spaces
    text = text.replace("\n", " ")
    text = text.replace("\t", " " * 8)
    text = styleTag.sub("", text)

    return text

def export_notes(collection, query, relative_path):
    data = []

    ids = collection.findCards(query)

    for id in ids:
        item = {}
        card = col.getCard(id)
        item["id"] = str(id)
        item["front"] = escapeText(card.q())
        item["back"] = escapeText(card.a())

        data.append(item)

    path = os.path.join(os.path.dirname(os.path.realpath(__file__)), relative_path)
    file = open(path, "w")
    json.dump(data, file)
    file.close()

export_notes(col, '"deck:Chinese characters" is:due', "v2/due.js")
export_notes(col, '"deck:Chinese characters"', "v2/data.js")
