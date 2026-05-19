import type {ScreenDefinition, ScreenBlockValue} from "../lib";

const CONTENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
];

export const withVisibleScreenDefinition: ScreenDefinition = {
    id: 'metadata-properties',
    screenType: 'normal',
    tabs: [],
    links: [],
    actions: [],
    form: {
        rows: [
            {
                displayType: 'header',
                groupId: 'metadata-summary',
                elements: [
                    {type: 'label', value: '$data#$.contentType'},
                    {type: 'label', value: '$data#$.resourceName'},
                    {type: 'label', value: '$data#$.contentLength'},
                    {type: 'label', value: '$data#$.lastModified'},
                ],
            },
            {
                displayType: 'group',
                groupId: 'metadata-image',
                visibleWhen: {
                    binding: '$data#$.contentType',
                    startsWith: 'image/'
                },
                elements: [
                    {type: 'label', value: '$data#$.image.width'},
                    {type: 'label', value: '$data#$.image.height'},
                    {type: 'label', value: '$data#$.image.bitsPerSample'},
                    {type: 'label', value: '$data#$.image.colorSpace'},
                    {type: 'label', value: '$data#$.image.compression'},
                    {type: 'label', value: '$data#$.image.cameraMake'},
                    {type: 'label', value: '$data#$.image.cameraModel'},
                    {type: 'label', value: '$data#$.image.exposureTime'},
                    {type: 'label', value: '$data#$.image.fNumber'},
                    {type: 'label', value: '$data#$.image.isoSpeed'},
                    {type: 'label', value: '$data#$.image.dateTimeOriginal'},
                    {
                        type: 'map',
                        label: 'GPS Position',
                        value: {
                            latitude: '$data#$.image.gpsLatitude',
                            longitude: '$data#$.image.gpsLongitude',
                        },
                        config: {zoom: 10},
                    },
                ],
            },
            {
                displayType: 'group',
                groupId: 'metadata-audio',
                visibleWhen: {
                    binding: '$data#$.contentType',
                    startsWith: 'audio/'
                },
                elements: [
                    {type: 'label', value: '$data#$.audio.duration'},
                    {type: 'label', value: '$data#$.audio.sampleRate'},
                    {type: 'label', value: '$data#$.audio.channels'},
                    {type: 'label', value: '$data#$.audio.bitrate'},
                    {type: 'label', value: '$data#$.audio.codec'},
                    {type: 'label', value: '$data#$.audio.artist'},
                    {type: 'label', value: '$data#$.audio.album'},
                    {type: 'label', value: '$data#$.audio.trackTitle'},
                    {type: 'label', value: '$data#$.audio.genre'},
                    {type: 'label', value: '$data#$.audio.releaseDate'},
                ],
            },
            {
                displayType: 'group',
                groupId: 'metadata-video',
                visibleWhen: {
                    binding: '$data#$.contentType',
                    startsWith: 'video/'
                },
                elements: [
                    {type: 'label', value: '$data#$.video.duration'},
                    {type: 'label', value: '$data#$.video.width'},
                    {type: 'label', value: '$data#$.video.height'},
                    {type: 'label', value: '$data#$.video.frameRate'},
                    {type: 'label', value: '$data#$.video.videoCodec'},
                    {type: 'label', value: '$data#$.video.audioCodec'},
                    {type: 'label', value: '$data#$.video.bitrate'},
                    {type: 'label', value: '$data#$.video.aspectRatio'},
                ],
            },
            {
                displayType: 'group',
                groupId: 'metadata-document',
                visibleWhen: {
                    binding: '$data#$.contentType',
                    oneOf: CONTENT_TYPES
                },
                elements: [
                    {type: 'label', value: '$data#$.document.title'},
                    {type: 'label', value: '$data#$.document.author'},
                    {type: 'label', value: '$data#$.document.creatorTool'},
                    {type: 'label', value: '$data#$.document.producer'},
                    {type: 'label', value: '$data#$.document.pdfVersion'},
                    {type: 'label', value: '$data#$.document.pageCount'},
                    {type: 'label', value: '$data#$.document.wordCount'},
                    {type: 'label', value: '$data#$.document.characterCount'},
                    {type: 'label', value: '$data#$.document.language'},
                    {type: 'label', value: '$data#$.document.created'},
                    {type: 'label', value: '$data#$.document.modified'},
                    {
                        type: 'tags',
                        value: '$data#$.document.keywords',
                    },
                ],
            },
        ],
    },
};

export const imageSample: ScreenBlockValue = {
    contentType: 'image/jpeg',
    resourceName: 'amsterdam-zuid-1948.jpg',
    contentLength: 4_182_344,
    lastModified: '1948-03-01T00:00:00Z',
    image: {
        width: 4096,
        height: 2731,
        bitsPerSample: 8,
        colorSpace: 'sRGB',
        compression: 'JPEG (old-style)',
        cameraMake: 'Leica Camera AG',
        cameraModel: 'M3',
        exposureTime: '1/125 sec',
        fNumber: 'f/8',
        isoSpeed: 200,
        dateTimeOriginal: '1948-03-01T10:14:00Z',
        gpsLatitude: 52.37302,
        gpsLongitude: 4.89856,
    },
};

export const audioSample: ScreenBlockValue = {
    contentType: 'audio/mpeg',
    resourceName: 'oral-history-interview.mp3',
    contentLength: 12_582_912,
    lastModified: '2024-09-12T09:30:00Z',
    audio: {
        duration: '00:42:15',
        sampleRate: 44100,
        channels: 'Stereo',
        bitrate: 192,
        codec: 'MPEG-1 Layer 3',
        artist: 'IISG Oral History Project',
        album: 'Amsterdam Voices',
        trackTitle: 'Interview with Lino Heilings',
        genre: 'Speech',
        releaseDate: '2024-10-01',
    },
};

export const videoSample: ScreenBlockValue = {
    contentType: 'video/mp4',
    resourceName: 'archival-footage-zuid.mp4',
    contentLength: 845_318_144,
    lastModified: '2023-06-04T14:20:00Z',
    video: {
        duration: '00:08:24',
        width: 1920,
        height: 1080,
        frameRate: 25,
        videoCodec: 'H.264 / AVC',
        audioCodec: 'AAC LC',
        bitrate: 12000,
        aspectRatio: '16:9',
    },
};

export const documentSample: ScreenBlockValue = {
    contentType: 'application/pdf',
    resourceName: 'collection-inventory.pdf',
    contentLength: 1_245_872,
    lastModified: '2025-11-19T16:42:00Z',
    document: {
        title: 'PAPA Amsterdam Zuid — Collection Inventory',
        author: 'IISG Archives',
        creatorTool: 'Adobe InDesign 19.0',
        producer: 'Adobe PDF Library 17.0',
        pdfVersion: '1.7',
        pageCount: 84,
        wordCount: 21_503,
        characterCount: 143_882,
        language: 'nl-NL',
        created: '2025-11-18T09:11:00Z',
        modified: '2025-11-19T16:42:00Z',
        keywords: ['inventory', 'archive', 'amsterdam', 'zuid', 'photography'],
    },
};
