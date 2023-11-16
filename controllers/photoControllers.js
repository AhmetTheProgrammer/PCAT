const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1;
  const photosPerPage = 2;

  const totalPhotos = await Photo.find().countDocuments();

  const photos = await Photo.find({})
    .sort('-dateCreated')
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);

  res.render('index', {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id }).exec();
  res.render('photo', {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, (err) => {
      if (err) throw err;
    });
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body, //veritabanında olan alanları çek
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const query = { _id: req.params.id };
  await Photo.findOneAndUpdate(query, {
    title: req.body.title,
    description: req.body.description,
  });
  res.redirect(`${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const query = { _id: req.params.id };
  const photo = await Photo.findOne(query);
  let deletedImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImage);

  await Photo.findOneAndDelete(query);
  res.redirect('/');
};
