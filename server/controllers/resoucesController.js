const { Resource } = require('../models/Resources');
const { sequelizeHospital } = require('../db');


const addResource = async (req, res) => {
    try {
        const { resourceType, category, total, available } = req.body;

        // Validation
        if (!resourceType || !category || total == null || available == null) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (available > total) {
            return res.status(400).json({ message: 'Available quantity cannot exceed total quantity' });
        }

        const newResource = await Resource.create({
            resourceType,
            category,
            total,
            available,
        });

        res.status(201).json(newResource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all resources
const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateResourceByID = async (req, res) => {
    try {
        const id = req.params.id;  // Use `req.params.id` if using URL parameter
        const { total, available } = req.body;

        const resource = await Resource.findByPk(id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Update fields
        if (total !== undefined) resource.total = total;
        if (available !== undefined) resource.available = available;
        resource.lastUpdated = new Date();

        await resource.save();
        res.json(resource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const checkAvailability = async (req, res) => {
    try {
        const { hospitalName, category, resourceType } = req.body;

        // Validate required fields
        if (!hospitalName || !category || !resourceType) {
            return res.status(400).json({ message: "Hospital name, category, and resource type are required." });
        }

        // Fetch resource information based on category and resourceType
        const resource = await Resource.findOne({
            where: { category, resourceType }
        });

        if (!resource) {
            return res.status(404).json({ message: "Resource not found for the given category and resource type." });
        }

        res.status(200).json({
            total: resource.total,
            available: resource.available
        });
    } catch (error) {
        console.error("Error checking availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUniqueResources = async (req, res) => {
    try {
        const { category } = req.query;

        if (!category) {
            return res.status(400).json({ success: false, message: 'Category is required' });
        }

        const resources = await Resource.findAll({
            attributes: [
                [sequelizeHospital.fn('DISTINCT', sequelizeHospital.col('resourceType')), 'resourceType']
            ],
            where: { category }  // Filter by category
        });

        const resourceTypes = resources.map(resource => resource.resourceType);
        res.status(200).json({ success: true, resourceTypes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch unique resources' });
    }
};

// Fetch unique categories
const getUniqueCategories = async (req, res) => {
    try {
        const categories = await Resource.findAll({
            attributes: [
                [sequelizeHospital.fn('DISTINCT', sequelizeHospital.col('category')), 'category']
            ],
        });
        const uniqueCategories = categories.map(category => category.category);
        res.status(200).json({ success: true, categories: uniqueCategories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch unique categories' });
    }
};


module.exports = { getAllResources, updateResourceByID,addResource,checkAvailability,getUniqueResources,getUniqueCategories };
