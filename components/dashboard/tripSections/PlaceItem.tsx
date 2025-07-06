import { Calendar, Clock, DollarSign, MapPin, Star } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export type PlaceType = 
  | 'attraction'
  | 'restaurant'
  | 'museum'
  | 'park'
  | 'beach'
  | 'shopping'
  | 'nightlife'
  | 'activity'
  | 'other';

export type OptionType = 
  | 'must_see'
  | 'would_like'
  | 'if_time'
  | 'backup';

export type StatusType = 
  | 'planned'
  | 'visited'
  | 'skipped';

export interface OpeningHours {
  monday?: { open: string; close: string } | null;
  tuesday?: { open: string; close: string } | null;
  wednesday?: { open: string; close: string } | null;
  thursday?: { open: string; close: string } | null;
  friday?: { open: string; close: string } | null;
  saturday?: { open: string; close: string } | null;
  sunday?: { open: string; close: string } | null;
}

export interface PlaceToVisit {
  id: number;
  trip_id: string;
  name: string;
  type: PlaceType;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  visit_date: string | null;
  visit_time: string | null;
  duration_hours: number | null;
  estimated_cost: number | null;
  currency: string;
  priority: OptionType;
  phone: string | null;
  website: string | null;
  rating: number | null; 
  opening_hours: OpeningHours | null;
  notes: string | null;
  tags: string[] | null;
  status: StatusType;
  created_at: string;
}

interface PlaceItemProps {
  place: PlaceToVisit;
  onPress?: () => void;
}

const PlaceItem = ({ place, onPress }: PlaceItemProps) => {
  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper function to format time
  const formatTime = (timeString: string | null) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to get place type display name
  const getPlaceTypeDisplay = (type: PlaceType) => {
    const typeMap = {
      attraction: 'Attraction',
      restaurant: 'Restaurant',
      museum: 'Museum',
      park: 'Park',
      beach: 'Beach',
      shopping: 'Shopping',
      nightlife: 'Nightlife',
      activity: 'Activity',
      other: 'Other'
    };
    return typeMap[type];
  };

  // Helper function to get priority color
  const getPriorityColor = (priority: OptionType) => {
    const colorMap = {
      must_see: '#FF6B6B',
      would_like: '#4ECDC4',
      if_time: '#45B7D1',
      backup: '#96CEB4'
    };
    return colorMap[priority];
  };

  // Helper function to get status color and text
  const getStatusInfo = (status: StatusType) => {
    const statusMap = {
      planned: { color: '#45B7D1', text: 'Planned' },
      visited: { color: '#4ECDC4', text: 'Visited' },
      skipped: { color: '#95A5A6', text: 'Skipped' }
    };
    return statusMap[status];
  };

  const statusInfo = getStatusInfo(place.status);
  const formattedDate = formatDate(place.visit_date);
  const formattedTime = formatTime(place.visit_time);

  return (
    <TouchableOpacity
      onPress={onPress}
      className='border border-primary rounded-2xl'
      style={{
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#2C3E50',
            marginBottom: 4,
          }}>
            {place.name}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#7F8C8D',
            textTransform: 'capitalize',
          }}>
            {getPlaceTypeDisplay(place.type)}
          </Text>
        </View>
        
        <View style={{
          backgroundColor: statusInfo.color,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{
            color: 'white',
            fontSize: 12,
            fontWeight: '500',
          }}>
            {statusInfo.text}
          </Text>
        </View>
      </View>

      {place.address && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MapPin size={16} color="#7F8C8D" style={{ marginRight: 6 }} />
          <Text style={{
            fontSize: 14,
            color: '#7F8C8D',
            flex: 1,
          }}>
            {place.address}
          </Text>
        </View>
      )}

      {(formattedDate || formattedTime) && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Calendar size={16} color="#7F8C8D" style={{ marginRight: 6 }} />
          <Text style={{
            fontSize: 14,
            color: '#7F8C8D',
          }}>
            {formattedDate && formattedTime 
              ? `${formattedDate} at ${formattedTime}`
              : formattedDate || formattedTime
            }
          </Text>
        </View>
      )}

      {place.duration_hours && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Clock size={16} color="#7F8C8D" style={{ marginRight: 6 }} />
          <Text style={{
            fontSize: 14,
            color: '#7F8C8D',
          }}>
            {place.duration_hours} hour{place.duration_hours !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {place.estimated_cost && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
              <DollarSign size={16} color="#2C3E50" style={{ marginRight: 2 }} />
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#2C3E50',
              }}>
                {place.currency} {place.estimated_cost}
              </Text>
            </View>
          )}

          {place.rating && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Star size={16} color="#F39C12" fill="#F39C12" style={{ marginRight: 4 }} />
              <Text style={{
                fontSize: 14,
                color: '#2C3E50',
                fontWeight: '500',
              }}>
                {place.rating}
              </Text>
            </View>
          )}
        </View>

        <View style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: getPriorityColor(place.priority),
        }} />
      </View>

      {place.tags && place.tags.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
          {place.tags.slice(0, 3).map((tag, index) => (
            <View
              key={index}
              style={{ 
                backgroundColor: '#ECF0F1',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginRight: 6,
                marginBottom: 4,
              }}
            >
              <Text style={{
                fontSize: 12,
                color: '#7F8C8D',
              }}>
                {tag}
              </Text>
            </View>
          ))}
          {place.tags.length > 3 && (
            <View style={{
              backgroundColor: '#ECF0F1',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{
                fontSize: 12,
                color: '#7F8C8D',
              }}>
                +{place.tags.length - 3} more
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PlaceItem;