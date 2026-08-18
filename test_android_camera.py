import cv2

url = "http://192.0.0.4:8080/video"

print("Connecting:", url)

cap = cv2.VideoCapture(url)

if not cap.isOpened():
    print("❌ OpenCV could not open the stream")
    exit()

print("✅ OpenCV connected!")

while True:
    ret, frame = cap.read()

    if not ret:
        print("❌ Failed to read frame")
        break

    cv2.imshow("Android IP Webcam", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()