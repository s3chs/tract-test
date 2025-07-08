export enum MainSection {
    Women = 'Women',
    Men = 'Men',
    Gear = 'Gear',
    Training = 'Training',
    Sale = 'Sale',
    WhatsNew = "What's New"
}

export enum WomenSubSection {
    Tops = 'Tops',
    Bottoms = 'Bottoms'
}

export enum MenSubSection {
    Tops = 'Tops',
    Bottoms = 'Bottoms'
}

export enum GearSubSection {
    Bags = 'Bags',
    FitnessEquipment = 'Fitness Equipment',
    Watches = 'Watches'
}

export enum TrainingSubSection {
    VideoDownload = 'Video Download'
}

export enum TopsFinalSection {
    Jackets = 'Jackets',
    HoodiesSweatshirts = 'Hoodies & Sweatshirts',
    Tees = 'Tees',
    BrasTanks = 'Bras & Tanks' // Women only
}

export enum BottomsFinalSection {
    Pants = 'Pants',
    Shorts = 'Shorts'
}

export type SubSection = WomenSubSection | MenSubSection | GearSubSection | TrainingSubSection;
export type FinalSection = TopsFinalSection | BottomsFinalSection