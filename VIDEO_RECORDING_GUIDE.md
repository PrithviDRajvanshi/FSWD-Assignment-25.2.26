# CRUD Update & Delete - Video Recording Guide

## 📹 Video Requirements

**Duration:** 3-4 minutes
**Format:** MP4 or similar
**Upload:** Google Drive with "Anyone with link can edit" permissions
**Content:** Demonstrate all update and delete functionality

---

## 🎬 Video Structure (3-4 minutes)

### Part 1: Introduction (30 seconds)
- **Show Application:** Start with logged-in dashboard
- **Explain Goal:** "This video demonstrates the Update and Delete operations for posts"
- **Show Context:** "Users can now edit and delete only their own content"

### Part 2: Edit Functionality (1.5 minutes)

#### Scenario 1: Successful Edit Flow
```
1. Navigate to dashboard with existing posts
2. Click "Edit" button on one of your posts
3. Show pre-filled form data loading
4. Modify title, description, and content
5. Add/remove tags
6. Click "Update Post" button
7. Show loading state during submission
8. Redirect to dashboard
9. Verify post is updated with new content
```

#### Scenario 2: Authorization Check
```
1. Try to access edit URL for another user's post
2. Show "not authorized" error message
3. Demonstrate that only post owners can edit
```

#### Scenario 3: Form Validation
```
1. Try to submit edit form with empty required fields
2. Show validation errors
3. Fill in valid data and submit successfully
```

### Part 3: Delete Functionality (1 minute)

#### Scenario 1: Successful Delete Flow
```
1. Click "Delete" button on a post
2. Show confirmation modal appears
3. Click "Delete" to confirm
4. Show post disappears immediately (optimistic update)
5. Verify post is permanently removed from list
```

#### Scenario 2: Delete Cancellation
```
1. Click "Delete" button
2. Show confirmation modal
3. Click "Cancel" button
4. Show modal closes and post remains
```

#### Scenario 3: Delete Error Handling
```
1. Attempt to delete post (if possible, simulate network error)
2. Show error message if deletion fails
3. Verify post reappears in list
```

### Part 4: Security & UX Demonstration (30 seconds)
```
1. Show that edit/delete buttons only appear for your posts
2. Demonstrate smooth loading states
3. Show error handling for failed operations
4. Highlight responsive design on different screen sizes
```

### Part 5: Conclusion (30 seconds)
- **Summarize:** "Update and Delete operations are now fully functional"
- **Key Features:** "With proper authorization, confirmation dialogs, and error handling"
- **Code Quality:** "Clean, maintainable code following best practices"

---

## 🎯 What to Demonstrate

### ✅ Must Include
- [ ] Edit button click → pre-filled form → successful update
- [ ] Delete button click → confirmation modal → post removal
- [ ] Authorization: Try editing someone else's post (should fail)
- [ ] Error handling: Show what happens when operations fail
- [ ] Loading states: During form submission and delete operations
- [ ] Form validation: Empty fields, invalid data
- [ ] UI responsiveness: Show on different screen sizes if possible

### ✅ Technical Details to Explain
- [ ] How pre-filled data works (API fetch on page load)
- [ ] Authorization checks (frontend UI hiding + backend validation)
- [ ] Optimistic updates (delete removes post immediately)
- [ ] Error recovery (revert changes on API failure)
- [ ] Confirmation dialogs prevent accidental deletions

---

## 🛠️ Recording Setup

### Tools Recommended
1. **OBS Studio** (free, professional quality)
2. **Windows Game Bar** (Win + G, built-in)
3. **Screencastify** (Chrome extension)
4. **Bandicam** (trial version)

### Recording Settings
- **Resolution:** 1080p or 720p
- **Frame Rate:** 30 FPS
- **Audio:** Clear voice, minimize background noise
- **Cursor:** Highlight clicks and interactions
- **Browser:** Show full application UI

### Test Environment
```bash
# Start backend
npm run dev

# Start frontend (new terminal)
cd client && npm run dev

# Open browser to http://localhost:5173
# Login and create some test posts first
```

---

## 📋 Pre-Recording Checklist

### Application Setup
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] At least 3 test posts created
- [ ] Multiple user accounts for testing authorization

### Test Scenarios Ready
- [ ] Edit flow: Modify existing post successfully
- [ ] Delete flow: Delete post with confirmation
- [ ] Authorization: Try to edit/delete other user's posts
- [ ] Errors: Test with network issues if possible
- [ ] Validation: Empty form submissions

### Recording Environment
- [ ] Quiet environment (no background noise)
- [ ] Good lighting for screen visibility
- [ ] Clear voice and pronunciation
- [ ] Browser window sized appropriately
- [ ] No distracting notifications

---

## 🎬 Video Script Outline

### Opening (0:00 - 0:30)
*"Welcome to the CRUD Update and Delete operations demonstration. In this video, I'll show you how users can edit and delete their own posts with proper authorization and smooth user experience."*

### Edit Demo (0:30 - 2:00)
*"Let's start with the edit functionality. Here I have my dashboard with some posts. I'll click the Edit button on one of my posts. Notice how the form is pre-filled with existing data. I'll modify the title, description, and content, then click Update. The loading state shows during submission, and I'm redirected back to see the updated post."*

*"Now let me show the authorization - if I try to edit someone else's post, I get an error message because only the post owner can edit their content."*

### Delete Demo (2:00 - 2:45)
*"Now for the delete functionality. When I click Delete, a confirmation modal appears to prevent accidental deletions. If I confirm, the post disappears immediately from the UI while the API call processes in the background."*

*"If I cancel instead, the modal closes and the post remains unchanged."*

### Error Handling (2:45 - 3:15)
*"Let me demonstrate error handling. If an operation fails, users see clear error messages and the UI reverts to the previous state."*

### Conclusion (3:15 - 3:30)
*"This completes the CRUD operations with secure Update and Delete functionality, featuring proper authorization, confirmation dialogs, and comprehensive error handling."*

---

## 📊 Video Quality Checklist

### Technical Quality
- [ ] Clear audio (no background noise)
- [ ] Readable text on screen
- [ ] Smooth cursor movements
- [ ] No lag or stuttering
- [ ] Professional resolution

### Content Quality
- [ ] Logical flow from introduction to conclusion
- [ ] All required scenarios demonstrated
- [ ] Clear explanations of functionality
- [ ] Professional presentation
- [ ] Appropriate pacing (not too fast/slow)

### Demonstration Quality
- [ ] All button clicks visible
- [ ] Form interactions shown clearly
- [ ] Error states captured
- [ ] Loading states visible
- [ ] Final results verified

---

## ☁️ Google Drive Upload

### Step 1: Upload Video
1. Go to [Google Drive](https://drive.google.com)
2. Click "New" → "File upload"
3. Select your recorded video file
4. Wait for upload to complete

### Step 2: Share Settings
1. Right-click the uploaded video
2. Click "Share" or "Get shareable link"
3. Change from "Restricted" to "Anyone with the link"
4. Set permissions to "Editor" (required for submission)
5. Click "Copy link"

### Step 3: Verify Link
- Link should look like: `https://drive.google.com/file/d/[VIDEO_ID]/view?usp=sharing`
- Test link in incognito window to ensure it works
- Confirm video plays without login requirements

---

## 📝 Submission Format

### Required Links
```
GitHub PR Link: https://github.com/PrithviDRajvanshi/FSWD-Assignment-25.2.26/pull/[PR_NUMBER]
Video Link: https://drive.google.com/file/d/[VIDEO_ID]/view?usp=sharing
```

### PR Description
Use the provided `PR_UPDATE_DELETE.md` template for comprehensive PR description.

---

## 🐛 Troubleshooting

### Recording Issues
- **Audio Problems:** Use external microphone, test recording first
- **Video Quality:** Close unnecessary applications, use higher resolution
- **Cursor Not Visible:** Enable cursor highlighting in recording software

### Application Issues
- **Ports Conflict:** Ensure 5000 and 5173 are available
- **Database Issues:** Check MongoDB connection
- **Auth Problems:** Clear browser cache, re-login

### Upload Issues
- **Large File:** Compress video or use higher quality settings
- **Drive Quota:** Check available storage space
- **Sharing Issues:** Double-check "Anyone with link" and "Editor" permissions

---

## 🎯 Success Criteria

### Video Evaluation (as per rubric)
- [ ] Clear explanation of assignment goal ✅
- [ ] Demonstration of update flow with pre-filled data ✅
- [ ] Demonstration of delete flow with confirmation ✅
- [ ] Explanation of authorization handling ✅
- [ ] Explanation of error handling and UX considerations ✅

### Technical Evaluation
- [ ] Update functionality works end-to-end ✅
- [ ] Delete functionality with confirmation dialog ✅
- [ ] Authorization checks (only owners can edit/delete) ✅
- [ ] Proper error handling for failed operations ✅
- [ ] Code structure, commit message, and branch usage ✅

---

## 📚 Reference Materials

- **PR Template:** `PR_UPDATE_DELETE.md`
- **Implementation:** Check commit `0c47db1` for all changes
- **Testing:** Use scenarios outlined above
- **Code:** Review files in `client/src/pages/EditPost.jsx`, `client/src/components/PostCard.jsx`

---

## ⏰ Time Management

- **Preparation:** 15-20 minutes (test all scenarios)
- **Recording:** 3-4 minutes (follow script)
- **Editing:** 5-10 minutes (trim if needed)
- **Upload:** 2-3 minutes
- **Testing:** 2-3 minutes (verify link works)

**Total Time:** ~30-45 minutes

---

## 🎉 Ready to Record!

Your Update and Delete functionality is fully implemented and ready for demonstration. Follow this guide to create a comprehensive 3-4 minute video that showcases all the features and meets the assignment requirements.

**Good luck! 🚀**

---

*Last Updated: March 9, 2026*
*Implementation: Complete ✅*
*Branch: feature/crud-update-delete*
*Commit: 0c47db1*
