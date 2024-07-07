const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error creating project" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && ["completed", "pending"].includes(status)) {
      query.status = status;
    }

    const projects = await Project.find(query);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error updating project" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project" });
  }
});
router.delete("/:id/team-members/:index", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= project.teamMembers.length) {
      return res.status(400).json({ message: "Invalid team member index" });
    }

    project.teamMembers.splice(index, 1);
    await project.save();

    res.json({ message: "Team member deleted successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error deleting team member" });
  }
});

module.exports = router;
