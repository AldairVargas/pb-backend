import { Site } from "../models/index.js";

export const getSites = async (req, res) => {
  try {
    const sites = await Site.findAll();
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSiteById = async (req, res) => {
  try {
    const site = await Site.findByPk(req.params.id);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }
    res.json(site);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSite = async (req, res) => {
  try {
    const site = await Site.create(req.body);
    res.status(201).json(site);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSite = async (req, res) => {
  try {
    const site = await Site.findByPk(req.params.id);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }
    await site.update(req.body);
    res.json(site);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};