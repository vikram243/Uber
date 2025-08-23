import { asyncHandler } from '../utils/asyncHandler.js';
// backend/src/routes/index.js
import { Router } from 'express';
import rideRoutes from './ride.routes.js';
import captainRoutes from './captain.routes.js'
import mapsRoutes from  './maps.routes.js'
import userRoutes from './user.routes.js'

const router = Router();


// Mount feature routes here
router.use('/rides', rideRoutes);
router.use('/captains', captainRoutes)
router.use('/maps', mapsRoutes)
router.use('/users', userRoutes)


export default router;