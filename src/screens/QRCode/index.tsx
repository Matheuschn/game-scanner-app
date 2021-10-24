import React, { useState } from 'react';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import BottomNavigation from '../../components/BottomNavigation';
import Modal from '../../components/Modal';
import { Container } from './styles';
import Gzip from 'rn-gzip';
import { Buffer } from 'buffer';

const QRCode = ({ navigation }: any) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const onRead = (read: BarCodeReadEvent) => {
        try {
            // TODO: Check if we can really discard the first 5 bytes
            const decodedRaw = read.rawData?.replace(/ec11/g, '').substr(5);
            const base64 = Buffer.from(decodedRaw!, 'hex').toString('base64');
            const data = Gzip.unzip(base64);
            const game = JSON.parse(data);

            navigation.navigate('Game', { game });
        } catch (error) {
            setModalVisible(true);
        }
    };

    return (
        <Container>
            <QRCodeScanner onRead={onRead} showMarker={true} />
            <Modal
                text="Error when reading QR Code, please try again."
                icon="error"
                visible={isModalVisible}
                onPressOut={() => {
                    setModalVisible(false);
                }}
            />
            <BottomNavigation />
        </Container>
    );
};

export default QRCode;
