// Event Listener for DOM Content Load
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupAutoTagging();
});

// Setup Event Listeners
function setupEventListeners() {
    const photos = document.querySelectorAll('.photo-item img');
    photos.forEach(photo => {
        photo.addEventListener('click', () => togglePhotoSelection(photo));
    });

    const saveTaggingBtn = document.getElementById('save-tagging');
    const saveAutoTaggingBtn = document.getElementById('save-auto-tagging');

    if (saveTaggingBtn) {
        saveTaggingBtn.addEventListener('click', openTaggingDialog);
    }

    if (saveAutoTaggingBtn) {
        saveAutoTaggingBtn.addEventListener('click', saveAutoTaggedPhotos);
    }
}

function setupAutoTagging() {
    const autoTagContainer = document.querySelector('.auto-tag-container');
    const events = document.querySelectorAll('#events-list input');
    const photos = document.querySelectorAll('.photo-item');

    // Clear existing content
    autoTagContainer.innerHTML = '<h2>Auto Tag</h2>';

    // Detailed Debugging
    console.log(`Total Events: ${events.length}`);
    console.log(`Total Photos: ${photos.length}`);

    // Extensive Logging
    console.group('Event Details');
    events.forEach((event, index) => {
        console.log(`Event ${index + 1}:`, {
            summary: event.getAttribute('data-summary'),
            date: event.getAttribute('data-parsed-date')
        });
    });
    console.groupEnd();

    console.group('Photo Details');
    photos.forEach((photo, index) => {
        console.log(`Photo ${index + 1}:`, {
            photoId: photo.getAttribute('data-photo-id'),
            date: photo.getAttribute('data-parsed-date')
        });
    });
    console.groupEnd();

    let autoTagGroupsFound = false;

    events.forEach(event => {
        const eventDateStr = event.getAttribute('data-parsed-date');
        const eventSummary = event.getAttribute('data-summary');
        const eventId = event.value;

        // Debug: Log each event processing
        console.log(`Processing Event: ${eventSummary}, Date: ${eventDateStr}`);

        const matchingPhotos = Array.from(photos).filter(photo => {
            const photoDateStr = photo.getAttribute('data-parsed-date');
            
            // Debug: Log matching process
            console.log(`Comparing Photo Date: ${photoDateStr}`);

            // Strict date matching
            return photoDateStr && eventDateStr && 
                   new Date(photoDateStr).toDateString() === new Date(eventDateStr).toDateString();
        });

        // Debug: Log matching photos
        console.log(`Matching Photos for ${eventSummary}: ${matchingPhotos.length}`);

        if (matchingPhotos.length > 0) {
            autoTagGroupsFound = true;

            const groupDiv = createAutoTagGroup(
                eventId, 
                eventSummary, 
                eventDateStr, 
                matchingPhotos
            );

            autoTagContainer.appendChild(groupDiv);
        }
    });

    if (!autoTagGroupsFound) {
        const noPhotosMessage = document.createElement('p');
        noPhotosMessage.textContent = 'No auto-tagged photos found in this session.';
        noPhotosMessage.style.color = '#666';
        noPhotosMessage.style.fontStyle = 'italic';
        autoTagContainer.appendChild(noPhotosMessage);
    }
}
// Create Auto Tag Group
function createAutoTagGroup(eventId, eventSummary, eventDateStr, matchingPhotos) {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('auto-tag-group');

    // Event Checkbox
    const eventCheckbox = document.createElement('input');
    eventCheckbox.type = 'checkbox';
    eventCheckbox.id = `auto-event-${eventId}`;
    eventCheckbox.classList.add('auto-event');
    eventCheckbox.setAttribute('data-summary', eventSummary);
    eventCheckbox.setAttribute('data-event-id', eventId);

    // Event Label
    const eventLabel = document.createElement('label');
    eventLabel.setAttribute('for', `auto-event-${eventId}`);
    eventLabel.textContent = `${eventSummary} (${eventDateStr})`;

    // Photos Container
    const photosContainer = document.createElement('div');
    photosContainer.classList.add('auto-photos-container');

    // Add Photos
    matchingPhotos.forEach((photo, index) => {
        const photoWrapper = createPhotoWrapper(photo, index);
        photosContainer.appendChild(photoWrapper);
    });

    // Assemble Group
    groupDiv.appendChild(eventCheckbox);
    groupDiv.appendChild(eventLabel);
    groupDiv.appendChild(photosContainer);

    // Event Checkbox Listener
    eventCheckbox.addEventListener('change', () => {
        const photosInGroup = groupDiv.querySelectorAll('.auto-photo');
        photosInGroup.forEach(photo => {
            photo.classList.toggle('selected', eventCheckbox.checked);
        });
        updateSelectedItems();
    });

    return groupDiv;
}

// Create Photo Wrapper
function createPhotoWrapper(photo, index) {
    const photoWrapper = document.createElement('div');
    photoWrapper.classList.add('auto-photo');
    photoWrapper.setAttribute('data-index', index + 1);
    photoWrapper.setAttribute('data-photo-id', photo.getAttribute('data-photo-id'));
    
    const photoImg = photo.querySelector('img').cloneNode(true);
    photoImg.style.maxWidth = '150px';
    photoImg.style.cursor = 'pointer';
    
    photoImg.addEventListener('click', () => {
        photoWrapper.classList.toggle('selected');
        updateSelectedItems();
    });

    photoWrapper.appendChild(photoImg);
    return photoWrapper;
}

// Toggle Photo Selection
function togglePhotoSelection(imgElement) {
    const photoItem = imgElement.closest('.photo-item');
    photoItem.classList.toggle('selected');
    updateSelectedItems();
}

// Update Selected Items
function updateSelectedItems() {
    // Selected Events
    const selectedEvents = document.querySelectorAll(
        '#events-list input:checked, .auto-event:checked'
    );
    const selectedEventsList = document.getElementById('selected-events');
    selectedEventsList.innerHTML = '';
    
    selectedEvents.forEach(event => {
        const li = document.createElement('li');
        li.textContent = event.getAttribute('data-summary');
        selectedEventsList.appendChild(li);
    });

    // Selected Photos
    const selectedPhotos = document.querySelectorAll(
        '.photo-item.selected, .auto-photo.selected'
    );
    const selectedPhotosDiv = document.getElementById('selected-photos');
    selectedPhotosDiv.innerHTML = '';
    
    selectedPhotos.forEach(photoItem => {
        const img = photoItem.querySelector('img').cloneNode(true);
        img.style.maxWidth = '100px';
        selectedPhotosDiv.appendChild(img);
    });
}

// Open Tagging Dialog
function openTaggingDialog() {
    // Gather selected events and photos
    const selectedEvents = Array.from(
        document.querySelectorAll('#events-list input:checked')
    ).map(event => ({
        id: event.value,
        summary: event.getAttribute('data-summary')
    }));

    const selectedPhotos = Array.from(
        document.querySelectorAll('.photo-item.selected')
    ).map(photo => ({
        id: photo.getAttribute('data-photo-id'),
        baseUrl: photo.querySelector('img').src
    }));

    // Validation
    if (selectedEvents.length === 0 || selectedPhotos.length === 0) {
        alert('Please select at least one event and one photo to tag.');
        return;
    }

    // Tag Name
    const defaultTagName = selectedEvents[0].summary || 'Untitled';
    const tagName = prompt('Enter a tag name:', defaultTagName);
    
    if (!tagName) {
        alert('Tag name is required.');
        return;
    }

    // Prepare and Send Data
    const data = {
        tagName: tagName,
        photos: selectedPhotos
    };

    fetch('/save_tagged_photos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('Tagged photos saved successfully!');
        } else {
            alert('Failed to save tagged photos.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while saving photos.');
    });
}

// Save Auto Tagged Photos
function saveAutoTaggedPhotos() {
    const selectedGroups = document.querySelectorAll('.auto-tag-group');
    const autoTaggedItems = [];

    selectedGroups.forEach(group => {
        const eventCheckbox = group.querySelector('.auto-event');
        const selectedPhotos = group.querySelectorAll('.auto-photo.selected');

        if (eventCheckbox.checked && selectedPhotos.length > 0) {
            const events = [{
                id: eventCheckbox.getAttribute('data-event-id'),
                summary: eventCheckbox.getAttribute('data-summary')
            }];

            const photos = Array.from(selectedPhotos).map(photo => ({
                id: photo.getAttribute('data-photo-id'),
                baseUrl: photo.querySelector('img').src
            }));

            autoTaggedItems.push({ events, photos });
        }
    });

    // Validation
    if (autoTaggedItems.length === 0) {
        alert('Please select at least one auto-tagged group.');
        return;
    }

    // Tag Name
    const defaultTagName = autoTaggedItems[0].events[0].summary || 'Untitled';
    const tagName = prompt('Enter a tag name:', defaultTagName);

    if (!tagName) {
        alert('Tag name is required.');
        return;
    }

    // Prepare Data
    const data = {
        tagName: tagName,
        events: autoTaggedItems.flatMap(item => item.events),
        photos: autoTaggedItems.flatMap(item => item.photos)
    };

    // Send to Server
    fetch('/save_auto_tagged_photos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('Auto-tagged photos saved successfully!');
        } else {
            alert('Failed to save auto-tagged photos.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while saving photos.');
    });
}