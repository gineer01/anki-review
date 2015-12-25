import anki
from anki.utils import ids2str, splitFields
import json
import os

col = anki.Collection("/Users/cdong/Dropbox/cdong-ltm1/Anki/cdong/collection.anki2")

data = []

ids = col.findCards('"deck:Chinese characters"')

for id, flds in col.db.execute("""
select guid, flds from notes
where id in
(select nid from cards
where cards.id in %s)""" % ids2str(ids)):
    item = {}

    # fields
    fields = splitFields(flds)
    item["front"] = fields[0]
    item["back"] = fields[1]

    data.append(item)

file = open(os.path.dirname(os.path.realpath(__file__)) + "/static/data.js", "w")
json.dump(data, file)
file.close()