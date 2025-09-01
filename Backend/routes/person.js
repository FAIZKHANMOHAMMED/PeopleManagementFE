const express = require('express');
const router = express.Router();
const Person = require('../models/person');

// GET /api/person: List all people
router.get('/', async (req, res) => {
    try {
        const people = await Person.find();
        res.json(people);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch people', error: err.message });
    }
});

// (removed view route: GET /person/new)

// POST /api/person: Create a single person
router.post('/', async (req, res) => {
    try {
        const person = await Person.create({
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            mobileNumber: req.body.mobileNumber
        });
        res.status(201).json(person);
    } catch (err) {
        res.status(400).json({ message: 'Error creating person', error: err.message });
    }
});

// GET /api/person/:id: Get a single person by ID
router.get('/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) return res.status(404).json({ message: 'Person not found' });
        res.json(person);
    } catch (err) {
        res.status(400).json({ message: 'Invalid ID', error: err.message });
    }
});

// PUT /api/person/:id: Update a person
router.put('/:id', async (req, res) => {
    try {
        const person = await Person.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                age: req.body.age,
                gender: req.body.gender,
                mobileNumber: req.body.mobileNumber
            },
            { new: true, runValidators: true }
        );
        if (!person) return res.status(404).json({ message: 'Person not found' });
        res.json(person);
    } catch (err) {
        res.status(400).json({ message: 'Error updating person', error: err.message });
    }
});

// DELETE /api/person/:id: Delete a person
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Person.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Person not found' });
        res.json({ message: 'Person deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting person', error: err.message });
    }
});

// (removed view route: POST /person/:id/delete)

module.exports = router;
