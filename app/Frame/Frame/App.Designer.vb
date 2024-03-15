<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Partial Class App
    Inherits System.Windows.Forms.Form

    'Form overrides dispose to clean up the component list.
    <System.Diagnostics.DebuggerNonUserCode()>
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    'Required by the Windows Form Designer
    Private components As System.ComponentModel.IContainer

    'NOTE: The following procedure is required by the Windows Form Designer
    'It can be modified using the Windows Form Designer.  
    'Do not modify it using the code editor.
    <System.Diagnostics.DebuggerStepThrough()>
    Private Sub InitializeComponent()
        Dim resources As System.ComponentModel.ComponentResourceManager = New System.ComponentModel.ComponentResourceManager(GetType(App))
        Me.bg = New System.Windows.Forms.PictureBox()
        Me.CloseButton = New System.Windows.Forms.Button()
        CType(Me.bg, System.ComponentModel.ISupportInitialize).BeginInit()
        Me.SuspendLayout()
        '
        'bg
        '
        Me.bg.Anchor = CType((((System.Windows.Forms.AnchorStyles.Top Or System.Windows.Forms.AnchorStyles.Bottom) _
            Or System.Windows.Forms.AnchorStyles.Left) _
            Or System.Windows.Forms.AnchorStyles.Right), System.Windows.Forms.AnchorStyles)
        Me.bg.Image = CType(resources.GetObject("bg.Image"), System.Drawing.Image)
        Me.bg.Location = New System.Drawing.Point(4, 5)
        Me.bg.Name = "bg"
        Me.bg.Size = New System.Drawing.Size(912, 589)
        Me.bg.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage
        Me.bg.TabIndex = 0
        Me.bg.TabStop = False
        '
        'CloseButton
        '
        Me.CloseButton.BackColor = System.Drawing.Color.White
        Me.CloseButton.BackgroundImage = CType(resources.GetObject("CloseButton.BackgroundImage"), System.Drawing.Image)
        Me.CloseButton.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch
        Me.CloseButton.FlatAppearance.BorderSize = 0
        Me.CloseButton.FlatStyle = System.Windows.Forms.FlatStyle.Flat
        Me.CloseButton.ForeColor = System.Drawing.SystemColors.ControlLight
        Me.CloseButton.Location = New System.Drawing.Point(12, 12)
        Me.CloseButton.Name = "CloseButton"
        Me.CloseButton.Size = New System.Drawing.Size(16, 16)
        Me.CloseButton.TabIndex = 1
        Me.CloseButton.TextAlign = System.Drawing.ContentAlignment.MiddleLeft
        Me.CloseButton.UseVisualStyleBackColor = False
        '
        'App
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(7.0!, 15.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.BackColor = System.Drawing.Color.Black
        Me.ClientSize = New System.Drawing.Size(920, 598)
        Me.Controls.Add(Me.CloseButton)
        Me.Controls.Add(Me.bg)
        Me.Name = "App"
        Me.Text = "Frame"
        Me.TopMost = True
        CType(Me.bg, System.ComponentModel.ISupportInitialize).EndInit()
        Me.ResumeLayout(False)

    End Sub

    Friend WithEvents bg As PictureBox
    Friend WithEvents CloseButton As Button
End Class
