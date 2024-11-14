import {types} from 'mediasoup';

export interface ProducerId {
  producerId: string;
  kind: types.MediaKind;
}

export interface CreateConsumerData {
  clientId: string;
  producerId: string;
  rtpCapabilities: types.RtpCapabilities;
}

export interface CreateProducerData {
  clientId: string;
  kind: types.MediaKind;
  rtpParameters: types.RtpParameters;
}

export interface ConnectWebRtcTransportData {
  clientId: string;
  dtlsParameters: types.DtlsParameters;
}

export interface GetConsumerData {
  clientId: string;
  consumerId: string;
}