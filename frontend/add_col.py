import sqlite3
try:
    conn = sqlite3.connect('../app.db')
    c = conn.cursor()
    c.execute('ALTER TABLE users ADD COLUMN nama VARCHAR;')
    conn.commit()
    conn.close()
    print("Column added")
except Exception as e:
    print(e)
