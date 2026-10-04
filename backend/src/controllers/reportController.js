import Report from "../models/Report.js";

export async function listReports(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({
        success: true,
        data: []
      });
    }

    const data = await Report.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data
    });
  } catch (e) {
    next(e);
  }
}

export async function getReport(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(404).json({
        success: false,
        message: "Demo report not stored"
      });
    }

    const data = await Report.findById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (e) {
    next(e);
  }
}

export async function createReport(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(201).json({
        success: true,
        data: {
          ...req.body,
          status: "Pending"
        }
      });
    }

    const doc = await Report.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: doc
    });
  } catch (e) {
    next(e);
  }
}

export async function moderateReport(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({
        success: true
      });
    }

    const data = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        adminNote: req.body.adminNote
      },
      {
        new: true
      }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    res.json({
      success: true,
      data
    });
  } catch (e) {
    next(e);
  }
}

export async function deleteReport(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({
        success: true,
        message: "Demo report deleted"
      });
    }

    const data = await Report.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Report not found"
      });
    }

    res.json({
      success: true,
      message: "Report deleted successfully"
    });
  } catch (e) {
    next(e);
  }
}