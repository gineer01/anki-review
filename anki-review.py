import anki
from anki.utils import splitFields

col = anki.Collection("/Users/cdong/Dropbox/cdong-ltm1/Anki/cdong/collection.anki2")

data = []

for id, flds, tags in col.db.execute("select guid, flds, tags from notes"):
    row = []

    # fields
    row.extend([f for f in splitFields(flds)])

    data.append("\t".join(row))

out = "\n".join(data)

print out