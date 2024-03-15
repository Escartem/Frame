Public Class App
    ' Dim drag As Boolean
    ' Dim mousex As Integer
    ' Dim mousey As Integer

    ' Window drag
    ' Private Sub bg_MouseDown(ByVal sender As Object, ByVal e As System.Windows.Forms.MouseEventArgs) Handles bg.MouseDown
    ' drag = True
    ' mousex = Windows.Forms.Cursor.Position.X - Me.Left
    ' mousey = Windows.Forms.Cursor.Position.Y - Me.Top
    ' End Sub

    ' Private Sub bg_MouseMove(ByVal sender As Object, ByVal e As System.Windows.Forms.MouseEventArgs) Handles bg.MouseMove
    ' If drag Then
    ' Me.Left = Windows.Forms.Cursor.Position.X - mousex
    ' Me.Top = Windows.Forms.Cursor.Position.Y - mousey
    ' End If
    ' End Sub

    ' Private Sub bg_MouseUp(ByVal sender As Object, ByVal e As System.Windows.Forms.MouseEventArgs) Handles bg.MouseUp
    ' drag = False
    ' End Sub

    Private IsFormBeingDragged As Boolean = False
    Private MouseDownX As Integer
    Private MouseDownY As Integer

    Private Sub App_MouseDown(ByVal sender As Object, ByVal e As MouseEventArgs) Handles bg.MouseDown

        If e.Button = MouseButtons.Left Then
            IsFormBeingDragged = True
            MouseDownX = e.X
            MouseDownY = e.Y
        End If
    End Sub

    Private Sub App_MouseUp(ByVal sender As Object, ByVal e As MouseEventArgs) Handles bg.MouseUp

        If e.Button = MouseButtons.Left Then
            IsFormBeingDragged = False
        End If
    End Sub

    Private Sub App_MouseMove(ByVal sender As Object, ByVal e As MouseEventArgs) Handles bg.MouseMove

        If IsFormBeingDragged Then
            Dim temp As Point = New Point()

            temp.X = Me.Location.X + (e.X - MouseDownX)
            temp.Y = Me.Location.Y + (e.Y - MouseDownY)
            Me.Location = temp
            temp = Nothing
        End If
    End Sub

    Protected Overrides Sub OnPaint(ByVal e As PaintEventArgs)
        e.Graphics.FillRectangle(Brushes.Gray, Top)
        e.Graphics.FillRectangle(Brushes.Gray, Left)
        e.Graphics.FillRectangle(Brushes.Gray, Right)
        e.Graphics.FillRectangle(Brushes.Gray, Bottom)
    End Sub


    Private Const HTLEFT As Integer = 10, HTRIGHT As Integer = 11, HTTOP As Integer = 12, HTTOPLEFT As Integer = 13, HTTOPRIGHT As Integer = 14, HTBOTTOM As Integer = 15, HTBOTTOMLEFT As Integer = 16, HTBOTTOMRIGHT As Integer = 17

    Protected Overrides Sub WndProc(ByRef m As System.Windows.Forms.Message)
        MyBase.WndProc(m)
        If m.Msg = &H84 Then
            Dim mp = Me.PointToClient(Cursor.Position)

            If TopLeft.Contains(mp) Then
                m.Result = CType(HTTOPLEFT, IntPtr)
            ElseIf TopRight.Contains(mp) Then
                m.Result = CType(HTTOPRIGHT, IntPtr)
            ElseIf BottomLeft.Contains(mp) Then
                m.Result = CType(HTBOTTOMLEFT, IntPtr)
            ElseIf BottomRight.Contains(mp) Then
                m.Result = CType(HTBOTTOMRIGHT, IntPtr)
            ElseIf Top.Contains(mp) Then
                m.Result = CType(HTTOP, IntPtr)
            ElseIf Left.Contains(mp) Then
                m.Result = CType(HTLEFT, IntPtr)
            ElseIf Right.Contains(mp) Then
                m.Result = CType(HTRIGHT, IntPtr)
            ElseIf Bottom.Contains(mp) Then
                m.Result = CType(HTBOTTOM, IntPtr)
            End If
        End If
    End Sub

    Dim rng As New Random
    Function randomColour() As Color
        Return Color.FromArgb(255, rng.Next(255), rng.Next(255), rng.Next(255))
    End Function

    Const ImaginaryBorderSize As Integer = 16

    Function Top() As Rectangle
        Return New Rectangle(0, 0, Me.ClientSize.Width, ImaginaryBorderSize)
    End Function

    Function Left() As Rectangle
        Return New Rectangle(0, 0, ImaginaryBorderSize, Me.ClientSize.Height)
    End Function

    Function Bottom() As Rectangle
        Return New Rectangle(0, Me.ClientSize.Height - ImaginaryBorderSize, Me.ClientSize.Width, ImaginaryBorderSize)
    End Function

    Function Right() As Rectangle
        Return New Rectangle(Me.ClientSize.Width - ImaginaryBorderSize, 0, ImaginaryBorderSize, Me.ClientSize.Height)
    End Function

    Function TopLeft() As Rectangle
        Return New Rectangle(0, 0, ImaginaryBorderSize, ImaginaryBorderSize)
    End Function

    Function TopRight() As Rectangle
        Return New Rectangle(Me.ClientSize.Width - ImaginaryBorderSize, 0, ImaginaryBorderSize, ImaginaryBorderSize)
    End Function

    Function BottomLeft() As Rectangle
        Return New Rectangle(0, Me.ClientSize.Height - ImaginaryBorderSize, ImaginaryBorderSize, ImaginaryBorderSize)
    End Function

    Function BottomRight() As Rectangle
        Return New Rectangle(Me.ClientSize.Width - ImaginaryBorderSize, Me.ClientSize.Height - ImaginaryBorderSize, ImaginaryBorderSize, ImaginaryBorderSize)
    End Function

    Private Sub App_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        Me.FormBorderStyle = FormBorderStyle.None
        Me.DoubleBuffered = True
        Me.SetStyle(ControlStyles.ResizeRedraw, True)

        Me.BackColor = Color.FromArgb(48, 49, 52)
        Me.TopMost = True
        ' rounded corners
        ' roundCorners(Me)
        ' roundCorners(Me.bg)
        ' roundCorners(bg)
        ' transition

        ' Me.CloseButton.Visible = False
        ' Me.FormBorderStyle = 5

        ' Me.Opacity = 0
        ' Dim i As Integer
        ' For i = 1 To 100 Step +1
        ' Me.Opacity = i / 100
        ' Me.Refresh()
        ' Threading.Thread.Sleep(10)
        ' Next
    End Sub

    Private Sub roundCorners(obj)
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

        ' Bottom Left
        DGP.AddArc(New Rectangle(0, obj.Height - 40, 40, 40), 90, 90)
        DGP.CloseFigure()

        obj.Region = New Region(DGP)
    End Sub



    Private Sub CloseButton_Click(sender As Object, e As EventArgs) Handles CloseButton.Click
        Me.Close()
    End Sub

    'Private Sub CloseButton_Hover(ByVal sender As Object, ByVal e As System.EventArgs) Handles CloseButton.MouseEnter
    'CloseButton.BackColor = Color.FromArgb(255, 33, 40)
    'CloseButton.
    'End Sub

    'Private Sub CloseButton_UnHover(ByVal sender As Object, ByVal e As System.EventArgs) Handles CloseButton.MouseLeave
    'CloseButton.BackColor = Color.FromArgb(43, 43, 43)
    'End Sub

End Class