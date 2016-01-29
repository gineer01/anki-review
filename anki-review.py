import anki
from anki.utils import ids2str, splitFields
import json
import os

col = anki.Collection("/Users/cdong/Dropbox/cdong-ltm1/Anki/cdong/collection.anki2")


def export_notes(collection, query, relative_path):
    data = []

    ids = collection.findCards(query)

    for id, flds in collection.db.execute("""
    select id, flds from notes
    where id in
    (select nid from cards
    where cards.id in %s)""" % ids2str(ids)):
        item = {}

        # fields
        fields = splitFields(flds)
        item["id"] = str(id)
        item["front"] = fields[0]
        item["back"] = fields[1]

        data.append(item)

    path = os.path.join(os.path.dirname(os.path.realpath(__file__)), relative_path)
    file = open(path, "w")
    json.dump(data, file)
    file.close()

export_notes(col, '"deck:Chinese characters" is:due', "v2/due.js")
export_notes(col, '"deck:Chinese characters"', "v2/data.js")
export_notes(col, '"deck:Chinese words"', "v2/words.js")
