from flask import Flask
from flask import Flask, flash, redirect, render_template, request, session, abort
import os, mysql.connector
import json, datetime
from json import JSONEncoder

app = Flask(__name__)

@app.route('/')
def route():
    return home()


class DateTimeEncoder(JSONEncoder):
        #Override the default method
        def default(self, obj):
            if isinstance(obj, (datetime.date, datetime.datetime)):
                return obj.isoformat()

@app.route('/home')
def home():
    mydb = mysql.connector.connect(
        host="10.148.0.30",
        user="ncm",
        passwd="Jakarta1",
        database="demo"
    )

    mycursor = mydb.cursor()
    mycursor.execute(
        """
        SELECT *
        FROM user
        """)
    data = mycursor.fetchall()
    mycursor.close()
    return render_template('homes.html', sites=data)


@app.route('/edituser/', methods=['GET'])
def edituser():
    id = request.args.get("id")
    mydb = mysql.connector.connect(
        host="10.148.0.30",
        user="ncm",
        passwd="Jakarta1",
        database="demo"
    )

    mycursors = mydb.cursor(dictionary=True)
    mycursors.execute("SELECT * FROM user where id =%s", (id,))
    data = mycursors.fetchall()
    mycursors.close()

    return json.dumps(data, indent=4, cls=DateTimeEncoder)

@app.route('/deleteuser/', methods=['GET'])
def deleteuser():
    id = request.args.get("id")
    mydb = mysql.connector.connect(
        host="10.148.0.30",
        user="ncm",
        passwd="Jakarta1",
        database="demo"
    )

    mycursors = mydb.cursor(dictionary=True)
    mycursors.execute("delete FROM user where id =%s", (id,))
    mydb.commit()
    mycursors.close()

    return json.dumps({'status':True}), 200, {'ContentType':'application/json'}


@app.route('/inputuser', methods=['POST'])
def inputuser():

    nama_lengkap = request.form['nama_lengkap']
    pendidikan_terakhir = request.form.get('pendidikan')
    no_ktp = request.form['no_ktp']
    pekerjaan = request.form['pekerjaan']
    tgl_lahir = request.form['tgl_lahir']
    data = {}
    data['inputerror'] = []
    data['error_string'] = []
    data['status'] = True



    if nama_lengkap == '' :
      data['inputerror'].append('nama_lengkap')
      data['error_string'].append('Nama Lengkap is required')
      data['status'] = False
    if no_ktp == '' :
      data['inputerror'].append('no_ktp')
      data['error_string'].append('No KTP is required')
      data['status'] = False
    if pekerjaan == '' :
      data['inputerror'].append('pekerjaan')
      data['error_string'].append('Pekerjaan is required')
      data['status'] = False
    if tgl_lahir == '' :
      data['inputerror'].append('tgl_lahir')
      data['error_string'].append('Tanggal Lahir is required')
      data['status'] = False
    if pendidikan_terakhir == '' :
      data['inputerror'].append('pendidikan_terakhir')
      data['error_string'].append('Pendidikan Terakhir is required')
      data['status'] = False

    if data['status'] == False:
       return json.dumps(data), 200, {'ContentType':'application/json'}
    else:
        mydb = mysql.connector.connect(
        host="10.148.0.30",
        user="ncm",
        passwd="Jakarta1",
        database="demo"
        )

        mycursor = mydb.cursor()
        mycursor.execute(
        "INSERT INTO user(nama,tgl_lahir,no_ktp,pekerjaan,pendidikan_terakhir)"
        "VALUES(%s,%s,%s,%s,%s)",
        (nama_lengkap, tgl_lahir, no_ktp, pekerjaan, pendidikan_terakhir))
        mydb.commit()
        mycursor.close()

        return json.dumps({'status':True}), 200, {'ContentType':'application/json'}


@app.route('/saveedituser', methods=['POST'])
def saveedituser():
    id = request.form['identitas']
    nama_lengkap = request.form['nama_lengkap']
    pendidikan_terakhir = request.form.get('pendidikan_terakhir')
    no_ktp = request.form['no_ktp']
    pekerjaan = request.form['pekerjaan']
    tgl_lahir = request.form['tgl_lahir']
    print (nama_lengkap)
    mydbss = mysql.connector.connect(
    host="10.148.0.30",
    user="ncm",
    passwd="Jakarta1",
    database="demo"
    )

    mycursorss = mydbss.cursor()

    query = "UPDATE user set nama = %s , tgl_lahir = %s, no_ktp = %s , pekerjaan = %s, pendidikan_terakhir = %s where id = %s"
    val = (nama_lengkap, tgl_lahir, no_ktp, pekerjaan, pendidikan_terakhir, id)
    mycursorss.execute(query, val)
    mydbss.commit()

    mycursorss.close()
    if mycursorss.rowcount == 1:
        return json.dumps({'status':True}), 200, {'ContentType':'application/json'}
    else:
        return json.dumps({'status':'Noting change'}), 200, {'ContentType':'application/json'}

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=1902)
