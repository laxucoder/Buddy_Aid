import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Users,
  Video,
  Phone,
  Square,
} from 'lucide-react';

import MapArt from '../../components/common/MapArt';
import { useEmergency } from '../../context/EmergencyContext';
import { useToast } from '../../context/ToastContext';
import { useLocation } from '../../hooks/useLocation';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';

import {
  updateEmergencyLocation,
  endEmergency,
} from '../../services/emergencyService';

import { uploadEmergencyRecording } from '../../services/mediaService';

export default function LiveEmergency() {
  const {
    active,
    emergencyId,
    stop,
  } = useEmergency();

  const nav = useNavigate();
  const { show } = useToast();

  const { getLocation } = useLocation();

  const {
    start: startRecording,
    stop: stopRecording,
    recording,
  } = useMediaRecorder();

  const [seconds, setSeconds] = useState(0);
  const [location, setLocation] = useState(null);
  const [ending, setEnding] = useState(false);
  const [recordingError, setRecordingError] = useState('');

  // TIMER
  useEffect(() => {
    if (!active) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [active]);

  // START CAMERA + MICROPHONE
  useEffect(() => {
    if (!active) return;

    let mounted = true;

    const activateRecording = async () => {
      try {
        await startRecording();

        if (mounted) {
          setRecordingError('');
        }
      } catch (error) {
        console.error(
          'Camera/microphone permission failed:',
          error
        );

        if (mounted) {
          setRecordingError(
            'Camera or microphone permission was denied.'
          );
        }
      }
    };

    activateRecording();

    return () => {
      mounted = false;
    };
  }, [active, startRecording]);

  // INITIAL LOCATION
  useEffect(() => {
    if (!active || !emergencyId) return;

    const updateInitialLocation = async () => {
      try {
        const current = await getLocation();

        setLocation(current);

        await updateEmergencyLocation(emergencyId, {
          latitude: current.latitude,
          longitude: current.longitude,
        });
      } catch (error) {
        console.error(
          'Initial location failed:',
          error
        );
      }
    };

    updateInitialLocation();
  }, [active, emergencyId, getLocation]);

  // LIVE LOCATION EVERY 10 SECONDS
  useEffect(() => {
    if (!active || !emergencyId) return;

    const timer = setInterval(async () => {
      try {
        const current = await getLocation();

        setLocation(current);

        await updateEmergencyLocation(emergencyId, {
          latitude: current.latitude,
          longitude: current.longitude,
        });

        console.log('Live emergency location updated');
      } catch (error) {
        console.error(
          'Live location update failed:',
          error
        );
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [active, emergencyId, getLocation]);

  const formatTime = (value) => {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  };

  // END EMERGENCY
  const handleEnd = async () => {
    try {
      setEnding(true);

      let recordingUrl = '';

      // Stop recording
      if (recording) {
        const blob = await stopRecording();

        if (blob) {
          try {
            const uploadResponse =
              await uploadEmergencyRecording(blob);

            recordingUrl =
              uploadResponse.data?.data?.url || '';
          } catch (uploadError) {
            console.error(
              'Recording upload failed:',
              uploadError
            );
          }
        }
      }

      // End emergency in MongoDB
      if (emergencyId) {
        await endEmergency(emergencyId, {
          recordingUrl,
        });
      }

      // Clear frontend emergency state
      await stop();

      show('Emergency ended successfully');

      nav('/dashboard');
    } catch (error) {
      console.error(
        'Failed to end emergency:',
        error
      );

      show('Unable to end emergency');
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="rounded-[24px] overflow-hidden">
      <div className="danger-page p-4 md:p-7">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-white/60 text-xs font-black uppercase tracking-widest">
              Live Emergency
            </div>

            <h1 className="text-2xl font-black mt-1">
              Emergency session active
            </h1>
          </div>

          <span className="badge bg-[#ff2f50] text-white">
            {formatTime(seconds)}
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_.7fr] gap-4">

          {/* REAL MAP */}
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <MapArt
              live
              location={location}
              seconds={seconds}
            />
          </div>

          <div className="space-y-3">

            {/* STATUS */}
            <div className="rounded-2xl bg-white/8 border border-white/10 p-4">
              <div className="text-white font-black text-sm">
                Emergency Status
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">

                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <MapPin
                    size={17}
                    className="mx-auto text-white"
                  />

                  <div className="text-[10px] font-black mt-2">
                    Location
                  </div>

                  <div className="text-[9px] text-emerald-300 mt-1">
                    {location ? 'LIVE' : 'Getting...'}
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <Users
                    size={17}
                    className="mx-auto text-white"
                  />

                  <div className="text-[10px] font-black mt-2">
                    Emergency
                  </div>

                  <div className="text-[9px] text-emerald-300 mt-1">
                    ACTIVE
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <Video
                    size={17}
                    className="mx-auto text-white"
                  />

                  <div className="text-[10px] font-black mt-2">
                    Recording
                  </div>

                  <div className="text-[9px] text-emerald-300 mt-1">
                    {recording ? 'ON' : 'OFF'}
                  </div>
                </div>

              </div>
            </div>

            {/* RECORDING STATUS */}
            <div className="rounded-2xl bg-white/8 border border-white/10 p-4">
              <div className="text-white font-black text-sm">
                Emergency Recording
              </div>

              <div className="mt-3 text-xs">
                {recording ? (
                  <span className="text-emerald-300">
                    ● Camera and microphone recording
                  </span>
                ) : recordingError ? (
                  <span className="text-red-300">
                    {recordingError}
                  </span>
                ) : (
                  <span className="text-white/50">
                    Starting camera...
                  </span>
                )}
              </div>
            </div>

            {/* LOCATION */}
            <div className="rounded-2xl bg-white/8 border border-white/10 p-4">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <MapPin size={16} />
                Current Location
              </div>

              {location && (
                <div className="mt-3 text-xs text-white/70">
                  <div>
                    Latitude: {location.latitude.toFixed(6)}
                  </div>

                  <div>
                    Longitude: {location.longitude.toFixed(6)}
                  </div>

                  <div className="text-white/40 mt-1">
                    Accuracy:{' '}
                    {Math.round(location.accuracy)} m
                  </div>
                </div>
              )}
            </div>

            {/* END */}
            <button
              onClick={handleEnd}
              disabled={ending}
              className={`btn w-full bg-white text-[#f11d43] ${
                ending
                  ? 'opacity-60 cursor-not-allowed'
                  : ''
              }`}
            >
              <Square
                size={15}
                fill="currentColor"
              />

              {ending
                ? 'Saving & Ending...'
                : 'End Emergency'}
            </button>

            <button
              onClick={() =>
                show(
                  'Official emergency service contact'
                )
              }
              className="btn w-full bg-white/10 border border-white/15 text-white"
            >
              <Phone size={15} />
              Contact official emergency service
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}