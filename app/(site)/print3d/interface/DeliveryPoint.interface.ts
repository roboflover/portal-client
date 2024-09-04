interface Phone {
    number: string;
}

interface WorkTime {
    day: number;
    time: string;
}

interface Dimensions {
    width: number;
    height: number;
    depth: number;
}

interface Location {
    country_code: string;
    region_code: number;
    region: string;
    city_code: number;
    city: string;
    fias_guid: string;
    postal_code: string;
    longitude: number;
    latitude: number;
    address: string;
    address_full: string;
    city_uuid: string;
}

export interface DeliveryPoint {
    code: string;
    name: string;
    uuid: string;
    address_comment: string;
    nearest_station: string;
    work_time: string;
    phones: Phone[];
    note: string;
    type: string;
    owner_code: string;
    take_only: boolean;
    is_handout: boolean;
    is_reception: boolean;
    is_dressing_room: boolean;
    is_ltl: boolean;
    have_cashless: boolean;
    have_cash: boolean;
    have_fast_payment_system: boolean;
    allowed_cod: boolean;
    work_time_list: WorkTime[];
    work_time_exception_list: any[];
    weight_min: number;
    weight_max: number;
    dimensions: Dimensions[];
    location: Location;
    fulfillment: boolean;
}