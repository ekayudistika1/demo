"use strict";

function alert_save()
{
  swal({
    title: "Good Job!",
    type: "success",
    text: "Data Successfully Saved.",
    confirmButtonColor: "#3cb878",
  });
  return false;
}


$("#modal-1").fireModal({body: 'Modal body text goes here.'});
$("#modal-2").fireModal({body: 'Modal body text goes here.', center: true});

let modal_3_body = '<p>Object to create a button on the modal.</p><pre class="language-javascript"><code>';
modal_3_body += '[\n';
modal_3_body += ' {\n';
modal_3_body += "   text: 'Login',\n";
modal_3_body += "   submit: true,\n";
modal_3_body += "   class: 'btn btn-primary btn-shadow',\n";
modal_3_body += "   handler: function(modal) {\n";
modal_3_body += "     alert('Hello, you clicked me!');\n"
modal_3_body += "   }\n"
modal_3_body += ' }\n';
modal_3_body += ']';
modal_3_body += '</code></pre>';
$("#modal-3").fireModal({
  title: 'Modal with Buttons',
  body: modal_3_body,
  buttons: [
    {
      text: 'Click, me!',
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
        alert('Hello, you clicked me!');
      }
    }
  ]
});


$("#modal-4").fireModal({
  footerClass: 'bg-whitesmoke',
  body: 'Add the <code>bg-whitesmoke</code> class to the <code>footerClass</code> option.',
  buttons: [
    {
      text: 'No Action!',
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});



$("#modal-5").fireModal({
  title: 'Login',
  body: $("#modal-login-part"),
  footerClass: 'bg-whitesmoke',
  autoFocus: false,
  onFormSubmit: function(modal, e, form) {
    // Form Data
    let form_data = $(e.target).serialize();
    console.log(form_data)

    // DO AJAX HERE
    let fake_ajax = setTimeout(function() {
      form.stopProgress();
      modal.find('.modal-body').prepend('<div class="alert alert-info">Please check your browser console</div>')

      clearInterval(fake_ajax);
    }, 1500);

    e.preventDefault();
  },
  shown: function(modal, form) {
    console.log(form)
  },
  buttons: [
    {
      text: 'Login',
      submit: true,
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});


$("#modal-6").fireModal({
  body: '<p>Now you can see something on the left side of the footer.</p>',
  created: function(modal) {
    modal.find('.modal-footer').prepend('<div class="mr-auto"><a href="#">I\'m a hyperlink!</a></div>');
  },
  buttons: [
    {
      text: 'No Action',
      submit: true,
      class: 'btn btn-primary btn-shadow',
      handler: function(modal) {
      }
    }
  ]
});

$('.oh-my-modal').fireModal({
  title: 'My Modal',
  body: 'This is cool plugin!'
});

function add_user()
{

  $('#inputmodal')[0].reset(); // reset form on modals
  $('.form-group').removeClass('has-error'); // clear error class
  $('.help-block').empty(); // clear error string
  $('#modal_adduser').modal('show'); // show bootstrap modal
  $('.modal-title').text('Add Employee'); // Set Title to Bootstrap modal title
}
function save_user()
{
  $('#buttonsaveuser').text('Processing...'); //change button text
  $('#buttonsaveuser').attr('disabled',true); //set button disable
  var url;
  url = "http://127.0.0.1:1902/inputuser";
  let form_data = $('#inputmodal').serialize();

  if (form_data.nama_lengkap == ''){
      $('[name="nama_lengkap"]').addClass('is-invalid');
  }
  // ajax adding data to database
  $.ajax({
    url : url,
    type: "POST",
    data: $('#inputmodal').serialize(),
    dataType: "JSON",
    success: function(data)
    {

      if(data.status) //if success close modal and reload ajax table
      {
        $('#modal_adduser').modal('hide');
        location.reload();
      }
      else
      {
        for (var i = 0; i < data.inputerror.length; i++)
        {

          $('[name="'+data.inputerror[i]+'"]').addClass('is-invalid'); //select parent twice to select div form-group class and add has-error class
          $('<div class="invalid-feedback">"'+data.error_string[i]+'"</div>').insertAfter('[name="'+data.inputerror[i]+'"]'); //select span help-block class set text error string
          if(document.form.pendidikan.selectedIndex==0){
              $('[name="pendidikan"]').addClass('is-invalid');
            }

        }

      }

      $('#buttonsaveuser').text('Submit'); //change button text
      $('#buttonsaveuser').attr('disabled',false); //set button enable


    },

    error: function (jqXHR, textStatus, errorThrown)
    {
      alert('Error adding / update data');
      $('#buttonsaveuser').text('Error...'); //change button text
      $('#buttonsaveuser').attr('disabled',false); //set button enable

    }
  });
}

function edituser(id)
{

  $('#form_edituser')[0].reset(); // reset form on modals
  $('.form-group').removeClass('has-error'); // clear error class
  $('.help-block').empty(); // clear error string

  //Ajax Load data from ajax
  $.ajax({
    url : "http://127.0.0.1:1902/edituser?id=" + id,
    type: "GET",
    dataType: "JSON",
    success: function(data)
    {
      $('[name="identitas"]').val(data[0].id);
      $('[name="nama_lengkap"]').val(data[0].nama);
      $('[name="tgl_lahir"]').val(data[0].tgl_lahir);
      $('[name="no_ktp"]').val(data[0].no_ktp);
      $('[name="pekerjaan"]').val(data[0].pekerjaan);
      $('#pendidikan_terakhir option:contains(' + data[0].pendidikan_terakhir + ')').attr('selected', 'selected');
      //$('[name="pendidikan_terakhir"]').val();
      $('[name="id"]').val(data.id);

      $('#modal_edit_user').modal('show'); // show bootstrap modal when complete loaded
      $('.modal-title').text('Edit User Data'); // Set title to Bootstrap modal title

    },
    error: function (jqXHR, textStatus, errorThrown)
    {
      alert('Error get data from ajax');
    }
  });
}

function saveedituser()
{
  $('#btnsaveeditnewemployee').text('Submit...'); //change button text
  $('#btnsaveeditnewemployee').attr('disabled',true); //set button disable
  var url;

  url = "http://127.0.0.1:1902/saveedituser";



  // ajax adding data to database
  $.ajax({
    url : url,
    type: "POST",
    data: $('#form_edituser').serialize(),
    dataType: "JSON",
    success: function(data)
    {

      if(data.status) //if success close modal and reload ajax table
      {
        $('#modal_edit_user').modal('hide');
        location.reload();
      }
      else
      {

        for (var i = 1; i < data.inputerror.length; i++)
        {
          $('[name="'+data.inputerror[i]+'"]').parent().parent().addClass('has-error'); //select parent twice to select div form-group class and add has-error class
          $('[name="'+data.inputerror[i]+'"]').next().text(data.error_string[i]); //select span help-block class set text error string
        }
      }
      $('#btnsaveedituser').text('Submit'); //change button text
      $('#btnsaveedituser').attr('disabled',false); //set button enable


    },
    error: function (jqXHR, textStatus, errorThrown)
    {
      alert('Error adding / update data');
      $('#btnsaveedituser').text('Error...'); //change button text
      $('#btnsaveedituser ').attr('disabled',false); //set button enable

    }
  });
}
