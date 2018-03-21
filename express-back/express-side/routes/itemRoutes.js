const mongoose = require("mongoose");
const express = require("express");
const multer = require('multer');
const itemRoutes = express.Router();

const Item = require('../models/itemModel');

// multer for photo
const myUploader = multer({
  dest: __dirname + "/../public/uploads/"
});

// mrrp
itemRoutes.get('/api/items/new', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to see items." });
    return;
  }
  Item.find()
    // retrieve all the info of the owners (needs "ref" in model)
    // don't retrieve "encryptedPassword" though
    .populate('user', { encryptedPassword: 0 })
    .exec((err, allTheItems) => {
      if (err) {
        res.status(500).json({ message: "Item find went bad." });
        return;
      }
      res.status(200).json(allTheItems);
    });
});

// create new phone
itemRoutes.post('/api/items/new', myUploader.single('itemPic'), (req, res, next) => {
  if(!req.user){
      res.status(401).json({message: "Log in to create phone."});
      return;
  }
  const newItem = new Item({
    category: req.body.itemCategory,
    name: req.body.itemName,
    description: req.body.itemDescription,
    owner: req.user._id,
    userName: req.user.username
    // userName: req.body.userName
  });
  if(req.file){
      newItem.image = '/uploads' + req.file.filename;
  }

  newItem.save((err) => {
      if(err){
          res.status(500).json({message: "Some weird error from DB."});
          return;
      }
      // validation errors
      if (err && newItem.errors){
          res.status(400).json({
              categoryError: newItem.errors.category,
          });
          return;
      }
      req.user.encryptedPassword = undefined;
      newItem.user = req.user;

      res.status(200).json(newItem);
  });
});

// list the phones
itemRoutes.get('/api/items', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Log in to see items." });
      return;
    }
    Item.find()
      // retrieve all the info of the owners (needs "ref" in model)
      // don't retrieve "encryptedPassword" though
      .populate('user', { encryptedPassword: 0 })
      .exec((err, allTheItems) => {
        if (err) {
          res.status(500).json({ message: "Item find went bad." });
          return;
        }
        res.status(200).json(allTheItems);
      });
});


// list single phone
itemRoutes.get("/api/items/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to see THE item." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Item.findById(req.params.id, (err, theItem) => {
    if (err) {
      //res.json(err);
      res.status(500).json({ message: "Items find went bad." });
      return;
    }

    res.status(200).json(theItem);
  });
});

// update the phone
itemRoutes.put('/api/items/:id', (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Log in to update the item." });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    const updates = {
        category: req.body.itemCategory,
        name: req.body.itemName,
        description: req.body.itemDescription,
        image: req.body.image    
    };

  Item.findByIdAndUpdate(req.params.id, updates, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Item updated successfully."
    });
  });
});

// delete phone
itemRoutes.delete("/api/items/:id", (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Log in to delete the item." });
    return;
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: "Specified id is not valid." });
    return;
  }

  Item.remove({ _id: req.params.id }, err => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: "Item has been removed."
    });
  });
});


module.exports = itemRoutes;