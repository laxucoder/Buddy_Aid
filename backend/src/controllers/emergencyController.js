import Emergency from '../models/Emergency.js';

export async function startEmergency(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(201).json({
        success: true,
        data: {
          id: 'demo-emergency',
          status: 'active',
        },
      });
    }

    const doc = await Emergency.create({
      userId: req.user.id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    });

    req.io?.to('admins').emit('emergency:started', {
      id: doc._id.toString(),
    });

    res.status(201).json({
      success: true,
      data: doc,
    });
  } catch (e) {
    next(e);
  }
}

export async function updateLocation(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({ success: true });
    }

    const doc = await Emergency.findByIdAndUpdate(
      req.params.id,
      {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found',
      });
    }

    req.io
      ?.to(`emergency:${req.params.id}`)
      .emit('emergency:location', {
        latitude: doc.latitude,
        longitude: doc.longitude,
      });

    res.json({
      success: true,
      data: doc,
    });
  } catch (e) {
    next(e);
  }
}

export async function endEmergency(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({ success: true });
    }

    const doc = await Emergency.findByIdAndUpdate(
      req.params.id,
      {
        status: 'ended',
        endedAt: new Date(),
        ...(req.body.recordingUrl
          ? { recordingUrl: req.body.recordingUrl }
          : {}),
      },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found',
      });
    }

    req.io?.emit('emergency:ended', {
      id: req.params.id,
    });

    res.json({
      success: true,
      data: doc,
    });
  } catch (e) {
    next(e);
  }
}

export async function listEmergencies(req, res, next) {
  try {
    if (!process.env.MONGODB_URI) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const data = await Emergency.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data,
    });
  } catch (e) {
    next(e);
  }
}