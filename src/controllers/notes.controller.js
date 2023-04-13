const notesCtrl = {};

const Note = require('../models/note');

notesCtrl.renderNoteForm = (req,res) => {

    res.render('notes/new-note');
};

notesCtrl.createNewNote = async (req,res) => {
    const {title, description} = req.body;
    const NewNote = new Note({title , description})
    NewNote.user = req.user.id;
    await NewNote.save();
    req.flash('success','Nota agregada correctamente');
    res.redirect('/notes')
};

notesCtrl.renderNote = async (req,res) => {
    const notes = await Note.find({user: req.user.id}).sort({createdAt: 'desc'});
    res.render('notes/all-notes', { notes });
};

notesCtrl.renderEditForm = async (req,res) => {
    const note = await Note.findById(req.params.id);
    if(note.user != req.user.id){
        req.flash('error_msg', 'Sin autorizacion');
        return res.redirect('/notes')
    }
    res.render('notes/edit-note', { note });
};

notesCtrl.updateNote = async (req,res) => {
    //console.log(req.body);
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description})
    req.flash('success','Nota actualizada correctamente');
    res.redirect('/notes');
    //console.log(req.body);
    //res.send('update note')
};
notesCtrl.deleteNote = async (req,res) => { 
    await  Note.findByIdAndDelete(req.params.id);
    req.flash('success','Nota eliminada correctamente');
    res.redirect('/notes')
};

module.exports = notesCtrl;