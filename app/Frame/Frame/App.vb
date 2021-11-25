Public Class App
    Private Sub App_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        ' rounded corners
        ' roundCorners(Me)
        ' transition
        ' Me.Opacity = 0
        ' Dim i As Integer
        ' For i = 1 To 100 Step +1
        ' Me.Opacity = i / 100
        ' Me.Refresh()
        ' Threading.Thread.Sleep(10)
        ' Next
    End Sub

    Private Sub roundCorners(obj As Form)
        obj.FormBorderStyle = FormBorderStyle.None

        Dim DGP As New Drawing2D.GraphicsPath
        DGP.StartFigure()

        ' Top Left
        DGP.AddArc(New Rectangle(0, 0, 40, 40), 180, 90)
        DGP.AddLine(40, 0, obj.Width - 40, 0)

        ' Top Right
        DGP.AddArc(New Rectangle(obj.Width - 40, 0, 40, 40), -90, 90)
        DGP.AddLine(obj.Width, 40, obj.Width, obj.Height - 40)

        ' Bottom Right
        DGP.AddArc(New Rectangle(obj.Width - 40, obj.Height - 40, 40, 40), 0, 90)
        DGP.AddLine(obj.Width - 40, obj.Height, 40, obj.Height)

        obj.Region = New Region(DGP)
    End Sub

End Class
