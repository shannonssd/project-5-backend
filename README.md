<h1> NEIGHBOURLY </h1>

<details>
<summary>Table of Contents</summary>
<br>
 <ol> 
    <li> <a href="#about"> About the Project </a></li>
    <li> <a href="#website"> Website </a></li>
    <li> <a href="#features"> Features </a></li>
    <li> <a href="#tech-used"> Technologies Used </a></li>
    <li> <a href="#rationale"> Rationale for Choice of Technologies </a></li>
    <li> <a href="#repo-links"> Repo Links </a></li>
    <li> <a href="#contributors"> Contributors </a></li>
  </ol>
</details>

<div id="about">
 <h2> About the Project </h2>
 NEIGHBOURLY is a community app that builds a greater sense of belonging amongst neighbours.
 <br/>
 It provides an avenue for users to give away pre-loved items to neighbours, discover and develop shared interests and chat with one another, all of which  collectively fosters a sense of community.
</div>
 
<div id="website">
<h2> Website </h2>
www.neighbourlyapp.live
</div>

<h2 id="features"> Features </h2>

<h3> 1. District-Based Communities </h3>
 
 <ul>
  <li>On signup, users are placed into a NEIGHBOURLY district based on the postal code entered.</li>
  <li>The hand-me-down items, interest groups and neighbours they encounter will be unique to their district, thus providing a tight-knit community experience.
  </ul>
 
![Apr-13-2022 16-10-13](https://user-images.githubusercontent.com/83911483/163130815-8724b178-1618-4ec4-bb6c-17d20e6d356e.gif)

![Apr-13-2022 16-10-43](https://user-images.githubusercontent.com/83911483/163130842-8233aa21-3dd0-4df9-b895-027022b9e2c0.gif)

 
 
<h3> 2. Give Away Pre-Owned Items </h3>
   <ul>
   <li>
     Browse through the marketplace containing items that other users want to give away.</li>
    <li>Chat with owners to find out more and arrange a pick-up.</li>
     </ul>
     
  ![hmd_contact_seller_hagrid](https://user-images.githubusercontent.com/85098526/162903993-fe788b6e-04a9-4e3e-96b7-7cbaf7605dd6.gif)
 
   <ul>
     <li> List items that you want to give away.</li>
     <li>Delete listing once the item has been given away.</li>
     <li>View all your listed items.</li>
  </ul>
  
  ![hmd_add_item](https://user-images.githubusercontent.com/85098526/162903967-5020cb53-e95d-47df-b02e-c86c5feb67a2.gif)

  <h3> 3. Interact with Neighbours Through Interest Groups </h3>
 <ul>
   <li>Browse through interest groups in your neighbourhood.</li>
   <li>Join interest groups to be to able like posts or see the full list of members.</li>
  </ul>
  
![ig_join_comment](https://user-images.githubusercontent.com/85098526/162904010-36454297-cbb5-404d-b1a1-27e726447b81.gif)
 
  <ul>
   <li> Start a conversation with interest group members.</li>
 </ul>
 
 ![Apr-13-2022 15-29-28](https://user-images.githubusercontent.com/83911483/163123308-39597797-a7bc-40c4-baf5-14457edb67e9.gif)
 
   <ul>
    <li> Start a new interest group.</li>
   </ul>
  
  ![ig_add](https://user-images.githubusercontent.com/85098526/162904006-2dc6e2bd-4939-4902-8854-552a1ff6b60d.gif)
 
<h3> 4. Chat with Neighbours </h3>
 <ul>
  <li> Continue your conversation with neighbours.</li>
 </ul>
 
 <details>
<summary><i><b> How It Was Achieved: </b></i></summary>
 <ol>
  <li><b> Establish Socket Connection: </b><br/> When a user enters a chatroom, a socket connection is established in the Express server. 
   <br/> The users socket ID, user ID and the user ID of the person they are texting is stored as a document in an <i>OnlineChatModel</i> collection in the database.
  <br/> The user is then placed in a socket room (channel) named after their user ID.</li>
  <li><b> Sending Real-Time Messages: </b><br/> When a user sends a message, the Express server will check the <i>OnlineChatModel</i> collection in the database to determine if the textee is also in the same chatroom.
  <br/> If they are, the user joins the textees socket room and the message is emitted to both rooms and hence the user and the textee. <br/> If not, the message is only sent to the user.</li>
  <li><b> Leaving Chatroom: </b><br/> When a user leaves the chatroom, their document is removed from the <i>OnlineChatModel</i> collection in the database, so as to allow for accurate checking of online users. </li>
 </ol>
</details>
 
![Apr-13-2022 17-00-34](https://user-images.githubusercontent.com/83911483/163140605-2977b93b-bc50-42d8-8a7a-95891d6e259d.gif)

 
 <h3> 5. Accessibility</h3>
 <ul>
  <li> Easily navigate from one page to another with menu buttons throughout the app.</li>
 </ul>
 
 ![accessibility](https://user-images.githubusercontent.com/85098526/162932480-abd07b16-a7dd-43e7-8d4a-6d8e911f9906.gif)
 
 
<div id="tech-used">
<h2> Technologies Used </h2>
 
 <h3>Frontend</h3>
 
 User Interface:
 <ul>
  <li><a href="https://reactjs.org/" target="_blank"> React.js <a/></li>
 </ul>
 
  Component Routing:
 <ul>
  <li><a href="https://reactrouter.com/" target="_blank"> React Router <a/></li>
 </ul>
 
 CSS Framework:
 <ul>
  <li><a href="https://mui.com/" target="_blank"> Material UI <a/></li> 
 </ul>
 
 Live Chatroom:
 <ul>
   <li><a href="https://socket.io/" target="_blank"> Socket.IO <a/></li>
 </ul>
 
 <h3> Backend </h3>
 
 Server:
 <ul>
   <li><a href="https://expressjs.com/" target="_blank"> Express.js <a/></li>
 </ul>
 
  Database:
 <ul>
   <li><a href="https://www.mongodb.com/docs/atlas/" target="_blank"> MongoDB Atlas <a/></li> 
   <li><a href="https://mongoosejs.com/" target="_blank"> Mongoose <a/></li>
 </ul>
 
   Authentication:
 <ul>
   <li><a href="https://jwt.io/" target="_blank"> JSON Web Token <a/></li>
 </ul>
 
 
  Live Chatroom:
 <ul>
   <li><a href="https://socket.io/" target="_blank"> Socket.IO <a/></li>
 </ul>
 
</div>

<div id="rationale">
<h2> Rationale for Choice of Technologies  </h2>

<h3> MongoDB </h3>
 <b>Reason for Choosing a NoSQL Database: </b>
<ul>
 <li> Due to a short development time, we required a flexible schema that would allow us to make changes quickly and easily as requirements changed. </li>
 <li> The size and complexity of the app meant that a lot of information was being accessed by the various components. <br/> This would have required multiple join tables if a SQL database was used. <br/> MongoDB allowed us to embed information, allowing for ease of storage and access of data.<br/> Since we had sets of data which needed to be queried alongside one another, a NoSQL database was better suited as it removed the need for multiple queries and joins. </li>
</ul>
 
<h3> Socket.IO </h3>
<ul>
 <li> Our desire to implement a live chatroom necessitated a Javascript library with such capabilities. </li>
 <li> Socket.IO's ability to enable real-time, bi-directional communication between the clients and our servers suited this need. </li>
</ul>

 <h3> JSON Web Token </h3>
 <ul>
 <li> We chose JSON Web Tokens as our method of authentication due to its increased security through its digital signature capabilities. </li>
  </ul>
</div>

<div id="repo-links">
<h2> Repo Links  </h2>

 <ul>
  <li><a href="https://github.com/shannonssd/project-5-frontend" target="_blank"> Frontend<a/></li>
   <li><a href="https://github.com/shannonssd/project-5-backend" target="_blank"> Backend<a/></li>
 </ul>
 
</div>

<h2 id="contributors"> Contributors </h2>

Hsiu Ping Gay | <a href="https://www.linkedin.com/in/hsiupinggay" target="_blank"> LinkedIn<a/>

Shannon Suresh | <a href="https://www.linkedin.com/in/shannon-suresh" target="_blank"> LinkedIn<a/>
